/**
 * Affiliate configuration for Nuvora.
 *
 * Map tool slugs or content types to affiliate programs.
 * Add entries as affiliate partnerships are established.
 */

export interface AffiliateConfig {
  vendor: string;
  url: string;
  description: string;
  commission?: string;
}

export const AFFILIATE_PROGRAMS: Record<string, AffiliateConfig> = {};

export function getAffiliateUrl(toolSlug: string): string | undefined {
  return AFFILIATE_PROGRAMS[toolSlug]?.url;
}
