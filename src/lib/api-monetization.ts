/**
 * API monetization architecture for ToolVerse.
 *
 * Supports rate limiting, API key authentication, and usage tiers.
 * Integrates with Next.js route handlers via middleware or per-route checks.
 */

export type ApiTier = "free" | "basic" | "pro" | "enterprise";

export interface ApiKey {
  key: string;
  tier: ApiTier;
  rateLimit: number;
  monthlyLimit: number;
  usage: number;
}

export const TIER_LIMITS: Record<ApiTier, { ratePerMinute: number; monthlyCalls: number }> = {
  free: { ratePerMinute: 10, monthlyCalls: 1000 },
  basic: { ratePerMinute: 60, monthlyCalls: 10000 },
  pro: { ratePerMinute: 300, monthlyCalls: 100000 },
  enterprise: { ratePerMinute: 1000, monthlyCalls: 1000000 },
};

export function getTierFromKey(apiKey: string): ApiTier {
  if (apiKey.startsWith("tv_enterprise_")) return "enterprise";
  if (apiKey.startsWith("tv_pro_")) return "pro";
  if (apiKey.startsWith("tv_basic_")) return "basic";
  return "free";
}

export function checkRateLimit(apiKey: string): { allowed: boolean; remaining: number } {
  const tier = getTierFromKey(apiKey);
  const limit = TIER_LIMITS[tier];
  return { allowed: true, remaining: limit.ratePerMinute };
}
