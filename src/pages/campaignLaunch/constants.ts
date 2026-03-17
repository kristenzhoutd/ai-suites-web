/**
 * Shared constants and style helpers for the Campaign Launch pages.
 */

// Meta objective labels — only objectives we can fully support (page-based promoted_object, image creatives)
export const META_OBJECTIVES: { value: string; label: string; enabled: boolean }[] = [
  { value: 'OUTCOME_AWARENESS', label: 'Awareness', enabled: true },
  { value: 'OUTCOME_TRAFFIC', label: 'Traffic', enabled: false },
  { value: 'OUTCOME_ENGAGEMENT', label: 'Engagement', enabled: false },
  { value: 'OUTCOME_LEADS', label: 'Leads', enabled: false },
  { value: 'OUTCOME_SALES', label: 'Sales', enabled: false },
];

export const SPECIAL_AD_CATEGORIES = [
  { value: 'NONE', label: 'None' },
  { value: 'HOUSING', label: 'Housing' },
  { value: 'EMPLOYMENT', label: 'Employment' },
  { value: 'CREDIT', label: 'Credit' },
  { value: 'ISSUES_ELECTIONS_POLITICS', label: 'Social Issues, Elections or Politics' },
];

export const CTA_TYPES = [
  'LEARN_MORE', 'SHOP_NOW', 'SIGN_UP', 'SUBSCRIBE', 'GET_OFFER',
  'CONTACT_US', 'DOWNLOAD', 'BOOK_TRAVEL', 'APPLY_NOW', 'BUY_NOW',
];

/**
 * Valid optimization goals per campaign objective — must stay in sync with meta-ads-client.ts.
 * Only goals that work with our current capabilities (image creatives, page-based promoted_object).
 */
export const OBJECTIVE_OPTIMIZATION_GOALS: Record<string, { value: string; label: string }[]> = {
  OUTCOME_TRAFFIC:    [{ value: 'LINK_CLICKS', label: 'Link Clicks' }, { value: 'LANDING_PAGE_VIEWS', label: 'Landing Page Views' }],
  OUTCOME_AWARENESS:  [{ value: 'REACH', label: 'Reach' }, { value: 'IMPRESSIONS', label: 'Impressions' }],
  OUTCOME_ENGAGEMENT: [{ value: 'POST_ENGAGEMENT', label: 'Post Engagement' }, { value: 'PAGE_LIKES', label: 'Page Likes' }],
  OUTCOME_LEADS:      [{ value: 'LINK_CLICKS', label: 'Link Clicks' }, { value: 'LANDING_PAGE_VIEWS', label: 'Landing Page Views' }],
  OUTCOME_SALES:      [{ value: 'LINK_CLICKS', label: 'Link Clicks' }, { value: 'LANDING_PAGE_VIEWS', label: 'Landing Page Views' }],
};

// Skeleton loading section definitions
export const LAUNCH_SKELETON_SECTIONS = [
  { key: 'campaign', title: 'Campaign', subtitle: 'Campaign name, objective, and budget', fields: 3 },
  { key: 'adsets', title: 'Ad Sets', subtitle: 'Targeting, audiences, and optimisation', fields: 4 },
  { key: 'creatives', title: 'Creatives', subtitle: 'Images, headlines, and copy', fields: 4 },
  { key: 'ads', title: 'Ads', subtitle: 'Ad set and creative assignments', fields: 3 },
];

// Section IDs for navigation variations
export type LaunchSectionId = 'campaign' | 'adSets' | 'creatives' | 'ads';

export const LAUNCH_SECTIONS: { id: LaunchSectionId; label: string }[] = [
  { id: 'campaign', label: 'Campaign Details' },
  { id: 'adSets', label: 'Ad Sets' },
  { id: 'creatives', label: 'Creatives' },
  { id: 'ads', label: 'Ads' },
];

// ── Style helpers ────────────────────────────────────────────────────────────

export const selectStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%236B7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat' as const,
  backgroundPosition: 'right 12px center',
};

export const inputClass = 'w-full px-3 py-2.5 border border-[#E8ECF3] rounded-lg text-sm text-gray-900 outline-none focus:border-[#1877F2] focus:ring-2 focus:ring-[#1877F2]/10 transition-all bg-white';
export const selectClass = `${inputClass} cursor-pointer appearance-none`;
export const labelClass = 'block text-[13px] font-medium text-gray-500 mb-1.5';

export type PlatformTab = 'meta' | 'google' | 'tiktok' | 'snapchat' | 'pinterest';

// ── Google Ads constants ────────────────────────────────────────────────────

export const GOOGLE_CAMPAIGN_TYPES: { value: string; label: string }[] = [
  { value: 'SEARCH', label: 'Search' },
  { value: 'DISPLAY', label: 'Display' },
  { value: 'VIDEO', label: 'Video (YouTube)' },
  { value: 'PERFORMANCE_MAX', label: 'Performance Max' },
];

export const GOOGLE_BIDDING_STRATEGIES: { value: string; label: string }[] = [
  { value: 'MAXIMIZE_CLICKS', label: 'Maximize Clicks' },
  { value: 'MAXIMIZE_CONVERSIONS', label: 'Maximize Conversions' },
  { value: 'TARGET_CPA', label: 'Target CPA' },
  { value: 'TARGET_ROAS', label: 'Target ROAS' },
  { value: 'MANUAL_CPC', label: 'Manual CPC' },
];

export const GOOGLE_KEYWORD_MATCH_TYPES: { value: string; label: string }[] = [
  { value: 'BROAD', label: 'Broad' },
  { value: 'PHRASE', label: 'Phrase' },
  { value: 'EXACT', label: 'Exact' },
];

export type GoogleLaunchSectionId = 'campaign' | 'adGroups' | 'assets' | 'ads';

export const GOOGLE_LAUNCH_SECTIONS: { id: GoogleLaunchSectionId; label: string }[] = [
  { id: 'campaign', label: 'Campaign Details' },
  { id: 'adGroups', label: 'Ad Groups' },
  { id: 'assets', label: 'Assets' },
  { id: 'ads', label: 'Ads' },
];

// ── Google launch config types ──────────────────────────────────────────────

export interface GoogleKeyword {
  text: string;
  matchType: 'BROAD' | 'PHRASE' | 'EXACT';
}

export interface GoogleAdGroup {
  localId: string;
  name: string;
  status: string;
  cpcBidMicros: number;
  keywords: GoogleKeyword[];
}

export interface GoogleResponsiveSearchAd {
  headlines: string[];
  descriptions: string[];
  finalUrls: string[];
  path1?: string;
  path2?: string;
}

export interface GoogleAd {
  localId: string;
  adGroupLocalId: string;
  name: string;
  type: string;
  responsiveSearchAd?: GoogleResponsiveSearchAd;
  status: string;
}

export interface GoogleAsset {
  localId: string;
  name: string;
  type: 'image' | 'logo';
  file?: {
    fileName: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
    previewUrl: string;
  };
  headline?: string;
  description?: string;
}

export interface GoogleLaunchConfig {
  campaign: {
    name: string;
    campaignType: string;
    dailyBudgetMicros: number;
    biddingStrategy: string;
    targetCpaMicros?: number;
    targetRoas?: number;
    status: string;
  };
  adGroups: GoogleAdGroup[];
  assets: GoogleAsset[];
  ads: GoogleAd[];
}
