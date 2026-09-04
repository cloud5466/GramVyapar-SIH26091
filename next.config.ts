import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Avoid generating repository instruction files during local development.
  agentRules: false,
};

export default nextConfig;
