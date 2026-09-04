"""Grounded advisory orchestration with deterministic graceful fallback."""

from __future__ import annotations

import json
import logging
import re
from typing import Any, Literal

from ai.prompts import PROMPT_VERSION
from ai.provider import (
    AISettings,
    AdvisoryProvider,
    create_provider,
    sanitize_provider_error,
)
from models.schemas import AdvisoryDraft, AdvisoryResult, AdvisorySwot, EvidencePack


logger = logging.getLogger(__name__)

ADVISORY_DISCLAIMER = (
    "This advisory explains the configured prototype evidence and deterministic "
    "results. It does not guarantee business success, profitability, financing "
    "eligibility or loan approval. Verify local conditions and official scheme terms."
)

HINDI_ADVISORY_DISCLAIMER = (
    "यह सलाह उपलब्ध प्रोटोटाइप डेटा और तय नियमों से निकले नतीजों को समझाती है। "
    "यह बिज़नेस की सफलता, मुनाफ़े, लोन पात्रता या लोन मंज़ूरी की गारंटी नहीं है। "
    "फैसला लेने से पहले स्थानीय जानकारी और आधिकारिक स्कीम की शर्तें जाँचें।"
)

HINDI_RATINGS = {
    "High Caution": "बहुत सावधानी",
    "Needs Validation": "जाँच ज़रूरी",
    "Promising": "अच्छी संभावना",
    "Strong Potential": "मज़बूत संभावना",
}


def _numbers_are_grounded(draft: AdvisoryDraft, evidence_pack: EvidencePack) -> bool:
    """Reject numerical claims that do not occur in the supplied evidence."""

    number_pattern = re.compile(r"\d[\d,]*(?:\.\d+)?")
    evidence_text = json.dumps(evidence_pack.model_dump(mode="json"), ensure_ascii=False)
    draft_text = json.dumps(draft.model_dump(mode="json"), ensure_ascii=False)
    normalize = lambda value: value.replace(",", "").lstrip("0") or "0"
    allowed = {normalize(item) for item in number_pattern.findall(evidence_text)}
    claimed = {normalize(item) for item in number_pattern.findall(draft_text)}
    return claimed.issubset(allowed)


def _missing_evidence_questions(evidence_pack: EvidencePack) -> list[str]:
    questions: list[str] = []
    labels = {
        "validated local demand measurements": "What did prospective local customers say they would buy?",
        "user-verified competitor count": "Which nearby alternatives have you verified in person?",
        "local selling price": "What prices are customers currently paying locally?",
        "existing business experience": "What relevant business experience do you already have?",
        "supplier distance": "How far away is your preferred supplier?",
        "monthly rent": "What monthly rent or premises cost should be planned?",
        "known competitors": "Which other nearby businesses serve the same customers?",
    }
    for item in evidence_pack.business_potential.missing_evidence:
        question = labels.get(item.lower(), f"Can you verify {item} locally?")
        if question not in questions:
            questions.append(question)
        if len(questions) == 4:
            break
    if not questions:
        questions.append("Have the mapped businesses and local demand been checked in person?")
    return questions


def _hindi_missing_evidence_questions(evidence_pack: EvidencePack) -> list[str]:
    labels = {
        "validated local demand measurements": "स्थानीय ग्राहकों ने क्या खरीदने की इच्छा बताई?",
        "user-verified competitor count": "आपने आस-पास किन दूसरे व्यवसायों की खुद जाँच की?",
        "local selling price": "ग्राहक अभी स्थानीय बाज़ार में क्या कीमत दे रहे हैं?",
        "monthly rent": "दुकान या जगह का मासिक किराया कितना होगा?",
        "existing business experience": "इस तरह के बिज़नेस का आपको कितना अनुभव है?",
        "supplier distance": "आपका पसंदीदा सप्लायर कितनी दूर है?",
    }
    questions = [
        labels.get(item.lower(), f"क्या आप स्थानीय स्तर पर {item} की जाँच कर सकते हैं?")
        for item in evidence_pack.business_potential.missing_evidence[:4]
    ]
    return questions or ["क्या आपने स्थानीय डिमांड और आस-पास के व्यवसायों की खुद जाँच की है?"]


def _build_hindi_fallback(
    evidence_pack: EvidencePack,
    ai_status: Literal["fallback", "disabled", "error"],
) -> AdvisoryResult:
    potential = evidence_pack.business_potential
    local = evidence_pack.local_market
    rating = HINDI_RATINGS.get(potential.rating, potential.rating)
    confidence = {"high": "उच्च", "medium": "मध्यम", "low": "कम"}.get(
        potential.confidence, potential.confidence
    )
    population_reason = (
        f"{local.population_estimate} की उपलब्ध जनसंख्या जानकारी को संभावित पहुँच के संकेत के रूप में इस्तेमाल किया गया है।"
        if local.population_estimate is not None
        else "जनसंख्या की जानकारी उपलब्ध नहीं है, इसलिए मार्केट की स्थानीय जाँच ज़रूरी है।"
    )
    competition_reason = (
        f"तय दायरे में आस-पास {local.mapped_competitors} संबंधित व्यवसाय मिले हैं; यह पूरी मार्केट सूची नहीं है।"
    )
    finance_reason = (
        "अनुमानित प्रोजेक्ट लागत के लिए तय वित्तीय नियम का मिलान मिला है।"
        if evidence_pack.finance.status == "configured"
        else "अनुमानित प्रोजेक्ट लागत के लिए अभी कोई तय वित्तीय नियम नहीं मिला है।"
    )
    operational_reason = (
        "बिज़नेस प्रोफ़ाइल के सप्लायर, मौसम और ऑपरेशनल जोखिमों को स्कोर में तय नियमों से देखा गया है।"
    )
    opportunities = [
        "दिए गए डिमांड संकेतों को स्थानीय ग्राहकों से जाँचें।",
        "आस-पास मिले व्यवसायों से अलग सेवा देने का तरीका देखें।",
        "सप्लायर के विकल्पों और शर्तों की तुलना करें।",
    ]
    risks = [
        "मैप में मिले व्यवसाय पूरी स्थानीय प्रतियोगिता नहीं दिखा सकते।",
        "बिज़नेस प्रोफ़ाइल में दर्ज ऑपरेशनल जोखिमों की स्थानीय जाँच बाकी है।",
        "अंतिम लोन पात्रता और मंज़ूरी अधिकृत संस्था तय करेगी।",
    ]
    return AdvisoryResult(
        summary=(
            f"तय नियमों से बिज़नेस की संभावना का स्कोर {potential.score}/100 है और रेटिंग {rating} है। "
            f"उपलब्ध जानकारी का भरोसा {confidence} है। आगे बढ़ने से पहले बाकी स्थानीय जानकारी जाँचें।"
        ),
        why_this_score=[
            population_reason,
            competition_reason,
            finance_reason,
            operational_reason,
        ],
        opportunities=opportunities,
        risks=risks,
        swot=AdvisorySwot(
            strengths=["उपलब्ध मार्केट और वित्तीय जानकारी को तय नियमों से जोड़ा गया है।"],
            weaknesses=["कुछ स्थानीय और व्यक्तिगत बिज़नेस जानकारी अभी सत्यापित नहीं है।"],
            opportunities=opportunities[:3],
            threats=risks[:3],
        ),
        next_steps=[
            "तय सेवा क्षेत्र में संभावित ग्राहकों से डिमांड की जाँच करें।",
            "सप्लायर, दुकान और संचालन खर्च के स्थानीय कोटेशन लें।",
            "अधिकृत संस्था से आधिकारिक लोन शर्तें और दस्तावेज़ जाँचें।",
        ],
        questions_to_verify=_hindi_missing_evidence_questions(evidence_pack),
        confidence_note=(
            f"कुल जानकारी का भरोसा {confidence} है। फैसला लेने से पहले पूछे गए सवालों से बाकी जानकारी की जाँच करें।"
        ),
        disclaimer=HINDI_ADVISORY_DISCLAIMER,
        prompt_version=PROMPT_VERSION,
        ai_status=ai_status,
    )


def build_fallback_advisory(
    evidence_pack: EvidencePack,
    *,
    ai_status: Literal["fallback", "disabled", "error"],
) -> AdvisoryResult:
    """Build safe guidance from existing fields without AI or new calculations."""

    if evidence_pack.response_language == "Hindi":
        return _build_hindi_fallback(evidence_pack, ai_status)

    potential = evidence_pack.business_potential
    profile = evidence_pack.business_profile
    local = evidence_pack.local_market
    finance = evidence_pack.finance
    components = potential.components

    why_this_score = [
        components.market_opportunity.reason,
        components.competition.reason,
        components.financial_fit.reason,
        components.operational_readiness.reason,
    ]
    opportunities = list(profile.key_demand_indicators[:3])
    if not opportunities:
        opportunities = ["Validate local demand with prospective customers."]

    risks = list(profile.main_operational_risks[:2])
    risks.extend(local.warnings[: max(0, 4 - len(risks))])
    if finance.status != "configured" and len(risks) < 4:
        risks.append("No financing rule matches the current project-cost range.")
    if not risks:
        risks = ["Mapped-business coverage may be incomplete and should be verified."]

    return AdvisoryResult(
        summary=(
            f"The deterministic Business Potential Score is {potential.score}/100, "
            f"rated {potential.rating}, with {potential.confidence} evidence confidence. "
            "Use this as a structured starting point and verify the remaining local evidence."
        ),
        why_this_score=why_this_score,
        opportunities=opportunities[:4],
        risks=risks[:4],
        swot=AdvisorySwot(
            strengths=[components.market_opportunity.reason],
            weaknesses=[
                f"Evidence confidence is {potential.confidence}; some inputs remain unverified."
            ],
            opportunities=opportunities[:3],
            threats=risks[:3],
        ),
        next_steps=[
            "Validate demand with potential customers in the stated service area.",
            "Check supplier, premises and operating costs using local quotations.",
            "Review official financing requirements with an authorised agency.",
        ],
        questions_to_verify=_missing_evidence_questions(evidence_pack),
        confidence_note=(
            f"Overall evidence confidence is {potential.confidence}. Missing or incomplete "
            "evidence is listed as questions to verify before making a decision."
        ),
        disclaimer=ADVISORY_DISCLAIMER,
        prompt_version=PROMPT_VERSION,
        ai_status=ai_status,
    )


def create_advisory(
    evidence_pack: EvidencePack,
    *,
    settings: AISettings | None = None,
    provider: AdvisoryProvider | None = None,
) -> AdvisoryResult:
    """Generate a validated advisory, falling back without failing analysis."""

    runtime_settings = settings or AISettings.from_env()
    if not runtime_settings.enabled:
        return build_fallback_advisory(evidence_pack, ai_status="disabled")
    if provider is None and not runtime_settings.api_key:
        return build_fallback_advisory(evidence_pack, ai_status="fallback")

    try:
        active_provider = provider or create_provider(runtime_settings)
        provider_result: Any = active_provider.generate(evidence_pack)
        draft = AdvisoryDraft.model_validate(provider_result)
        if not _numbers_are_grounded(draft, evidence_pack):
            raise ValueError("Advisory contains a numerical claim absent from evidence")
        return AdvisoryResult(
            **draft.model_dump(),
            prompt_version=PROMPT_VERSION,
            ai_status="generated",
        )
    except Exception as error:
        logger.warning(
            "Grounded advisory provider failed; using fallback: %s",
            sanitize_provider_error(error, runtime_settings.api_key),
        )
        return build_fallback_advisory(evidence_pack, ai_status="error")
