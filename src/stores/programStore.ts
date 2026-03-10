/**
 * Program Store — Zustand store managing PaidMediaProgram lifecycle.
 *
 * A program is a lightweight envelope holding references to existing artifacts
 * (briefs, blueprints, launch configs) and tracking step completion.
 */

import { create } from 'zustand';
import type {
  PaidMediaProgram,
  ProgramStepId,
  ProgramStatus,
  ProgramStep,
  ProgramChannelConfig,
  ChannelPlatform,
} from '../types/program';
import { programStorage } from '../services/programStorage';
import { launchConfigStorage } from '../services/launchConfigStorage';

// ── Helpers ──────────────────────────────────────────────────────────────────

function generateId(): string {
  return `prog-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function defaultSteps(): ProgramStep[] {
  return [
    { stepId: 1, label: 'Campaign Brief', status: 'pending' },
    { stepId: 2, label: 'Blueprint', status: 'pending' },
    { stepId: 3, label: 'Campaign Configuration', status: 'pending' },
    { stepId: 4, label: 'Review & Launch', status: 'pending' },
  ];
}

function defaultChannels(): ProgramChannelConfig[] {
  return [
    { platform: 'meta', enabled: true, launchConfigIds: [], isConfigured: false },
    { platform: 'google', enabled: false, launchConfigIds: [], isConfigured: false },
    { platform: 'tiktok', enabled: false, launchConfigIds: [], isConfigured: false },
    { platform: 'snapchat', enabled: false, launchConfigIds: [], isConfigured: false },
    { platform: 'pinterest', enabled: false, launchConfigIds: [], isConfigured: false },
  ];
}

/** Try to derive a meaningful program name from a serialized brief snapshot. */
function deriveProgramName(snapshotJson: string): string | undefined {
  try {
    const data = JSON.parse(snapshotJson) as Record<string, unknown>;
    const cd = data.campaignDetails;
    if (typeof cd === 'object' && cd !== null && 'campaignName' in cd) {
      const name = (cd as Record<string, string>).campaignName;
      if (name?.trim()) return name.trim().slice(0, 80);
    }
    if (typeof cd === 'string' && cd.trim()) {
      return cd.trim().split(/\s*[—–-]\s*/)[0].slice(0, 80);
    }
    const fallback = (data.brandProduct as string) || (data.businessObjective as string);
    if (fallback?.trim()) return fallback.trim().slice(0, 80);
  } catch {
    // Corrupt snapshot
  }
  return undefined;
}

// ── Demo Programs ────────────────────────────────────────────────────────────

const DEMO_BRIEF_SPRING = {
  campaignDetails: 'Spring Collection Launch',
  brandProduct: 'Spring 2026 Fashion Collection',
  businessObjective: 'Drive conversions for seasonal collection launch across Meta, Google, and TikTok',
  businessObjectiveTags: ['conversions', 'seasonal'],
  primaryGoals: ['Increase online sales by 25%', 'Drive foot traffic to stores'],
  secondaryGoals: ['Build email subscriber list', 'Grow social following'],
  primaryKpis: ['ROAS', 'Conversions', 'CPA'],
  secondaryKpis: ['CTR', 'Reach', 'Engagement Rate'],
  inScope: ['Paid social', 'Search ads', 'Display retargeting'],
  outOfScope: ['Organic social', 'Email marketing'],
  primaryAudience: ['Fashion-forward women 25-44', 'Previous customers'],
  secondaryAudience: ['Lookalike audiences', 'Interest-based: fashion & lifestyle'],
  mandatoryChannels: ['Meta', 'Google'],
  optionalChannels: ['TikTok'],
  budgetAmount: '$45,000',
  pacing: 'Even distribution over campaign duration',
  phases: '',
  prospectingSegments: ['Fashion enthusiasts', 'Seasonal shoppers'],
  retargetingSegments: ['Cart abandoners', 'Past purchasers'],
  suppressionSegments: ['Recent converters (30 days)'],
  timelineStart: '2026-02-10',
  timelineEnd: '2026-04-15',
};

const DEMO_BRIEF_AWARENESS = {
  campaignDetails: 'Brand Awareness Q1',
  brandProduct: 'Brand Portfolio',
  businessObjective: 'Increase brand visibility and top-of-mind awareness across YouTube, Meta, and Display',
  businessObjectiveTags: ['awareness', 'brand'],
  primaryGoals: ['Achieve 5M+ reach', 'Increase unaided awareness by 8 pts'],
  secondaryGoals: ['Grow social engagement', 'Drive site traffic'],
  primaryKpis: ['Reach', 'Brand Lift', 'Ad Recall'],
  secondaryKpis: ['Impressions', 'Video Views', 'Engagement'],
  inScope: ['YouTube pre-roll', 'Meta video ads', 'Display banners'],
  outOfScope: ['Search ads', 'Email'],
  primaryAudience: ['Adults 18-54', 'Category buyers'],
  secondaryAudience: ['Lapsed customers', 'Competitor audiences'],
  mandatoryChannels: ['YouTube', 'Meta'],
  optionalChannels: ['Display'],
  budgetAmount: '$75,000',
  pacing: 'Front-loaded first 2 weeks',
  phases: '',
  prospectingSegments: ['In-market buyers', 'Interest-based audiences'],
  retargetingSegments: ['Site visitors (90 days)'],
  suppressionSegments: ['Recent purchasers'],
  timelineStart: '2026-01-15',
  timelineEnd: '2026-03-31',
};

const DEMO_BRIEF_PRODUCT = {
  campaignDetails: 'Product V2 Launch',
  brandProduct: 'Product V2',
  businessObjective: 'Drive awareness and consideration for new product launch across Meta, Google, LinkedIn, and TikTok',
  businessObjectiveTags: ['awareness', 'product launch'],
  primaryGoals: ['Generate 2M impressions in first week', 'Drive 50K landing page visits'],
  secondaryGoals: ['Capture 5K email sign-ups', 'Generate PR coverage'],
  primaryKpis: ['Impressions', 'Landing Page Views', 'Sign-ups'],
  secondaryKpis: ['CTR', 'Social Shares', 'Engagement Rate'],
  inScope: ['Meta ads', 'Google search & display', 'LinkedIn sponsored content', 'TikTok ads'],
  outOfScope: ['Influencer marketing', 'Offline channels'],
  primaryAudience: ['Early adopters 25-40', 'Tech-savvy professionals'],
  secondaryAudience: ['Industry influencers', 'Existing user base'],
  mandatoryChannels: ['Meta', 'Google'],
  optionalChannels: ['LinkedIn', 'TikTok'],
  budgetAmount: '$120,000',
  pacing: 'Heavy launch week, then sustained',
  phases: '',
  prospectingSegments: ['Tech early adopters', 'Competitor users'],
  retargetingSegments: ['Beta testers', 'Waitlist sign-ups'],
  suppressionSegments: ['Existing V1 power users'],
  timelineStart: '2026-03-10',
  timelineEnd: '2026-04-30',
};

const DEMO_BRIEF_SUMMER = {
  campaignDetails: 'Summer Campaign 2026',
  brandProduct: 'Summer Collection',
  businessObjective: 'Summer seasonal push across all major channels',
  businessObjectiveTags: ['conversions', 'seasonal', 'multi-channel'],
  primaryGoals: ['Achieve $1M in summer sales', 'Reach 10M unique users'],
  secondaryGoals: ['Build retargeting pools', 'Test Pinterest as new channel'],
  primaryKpis: ['Revenue', 'ROAS', 'Reach'],
  secondaryKpis: ['CPA', 'Frequency', 'Engagement'],
  inScope: ['Meta ads', 'Google ads', 'TikTok ads', 'Pinterest ads'],
  outOfScope: ['Email', 'Organic social'],
  primaryAudience: ['Summer shoppers 18-55', 'Outdoor enthusiasts'],
  secondaryAudience: ['Travel planners', 'Family decision-makers'],
  mandatoryChannels: ['Meta', 'Google'],
  optionalChannels: ['TikTok', 'Pinterest'],
  budgetAmount: '$200,000',
  pacing: 'Ramp up May, peak June-July',
  phases: '',
  prospectingSegments: ['Summer travelers', 'Outdoor activity seekers'],
  retargetingSegments: ['Previous summer buyers', 'Newsletter subscribers'],
  suppressionSegments: ['Recent purchasers (14 days)'],
  timelineStart: '2026-05-01',
  timelineEnd: '2026-07-31',
};

/** Demo blueprint data for seeding into blueprint store */
export const DEMO_BLUEPRINTS = [
  {
    id: 'demo-bp-spring',
    name: 'Spring Collection Launch — Balanced',
    variant: 'balanced' as const,
    confidence: 'High' as const,
    channels: ['Meta', 'Google', 'TikTok'],
    channelAllocations: [
      { name: 'Meta Ads', budgetPercent: 50, budgetAmount: '$22,500', role: 'Primary conversion driver', formats: ['Carousel', 'Static', 'Stories'] },
      { name: 'Google Ads', budgetPercent: 35, budgetAmount: '$15,750', role: 'Search capture + Shopping', formats: ['Search', 'Shopping', 'Display'] },
      { name: 'TikTok', budgetPercent: 15, budgetAmount: '$6,750', role: 'Younger demo reach', formats: ['In-Feed', 'Spark Ads'] },
    ],
    audiences: ['Fashion-forward women 25-44', 'Previous customers', 'Lookalike audiences'],
    budget: { amount: '$45,000', pacing: 'Even distribution over 9 weeks' },
    metrics: { reach: '2.4M', ctr: '2.4%', roas: '4.1x', conversions: '12,450' },
    messaging: 'Refresh your wardrobe — the Spring 2026 collection is here. Premium fabrics, modern silhouettes, timeless style.',
    cta: 'Shop the Collection',
    creativeBrief: {
      primaryAngle: 'Seasonal refresh with premium quality emphasis',
      confidence: 'High',
      supportingMessages: ['Limited edition pieces', 'Free shipping over $100', 'New arrivals weekly'],
      recommendedFormats: ['Carousel (product showcase)', 'Static (hero imagery)', 'Stories (behind-the-scenes)'],
      fatigueRisk: ['High frequency on Meta carousel after week 4'],
      refreshPlan: ['Rotate hero imagery bi-weekly', 'Introduce UGC content in week 5'],
    },
  },
  {
    id: 'demo-bp-awareness',
    name: 'Brand Awareness Q1 — Balanced',
    variant: 'balanced' as const,
    confidence: 'High' as const,
    channels: ['YouTube', 'Meta', 'Display'],
    channelAllocations: [
      { name: 'YouTube', budgetPercent: 40, budgetAmount: '$30,000', role: 'Video reach & brand lift', formats: ['Pre-roll', 'Bumper ads'] },
      { name: 'Meta Ads', budgetPercent: 35, budgetAmount: '$26,250', role: 'Social engagement & reach', formats: ['Video', 'Carousel', 'Stories'] },
      { name: 'Display Network', budgetPercent: 25, budgetAmount: '$18,750', role: 'Contextual reach on premium publishers', formats: ['Banner', 'Rich Media'] },
    ],
    audiences: ['Adults 18-54', 'Category buyers', 'Lapsed customers'],
    budget: { amount: '$75,000', pacing: 'Front-loaded first 2 weeks' },
    metrics: { reach: '5.1M', ctr: '2.6%', roas: '3.2x', conversions: '8,230' },
    messaging: 'Discover what sets us apart. Quality you can trust, experiences you\'ll remember.',
    cta: 'Learn More',
    creativeBrief: {
      primaryAngle: 'Brand trust and quality differentiation',
      confidence: 'High',
      supportingMessages: ['Award-winning quality', 'Trusted by millions', 'Join the community'],
      recommendedFormats: ['Video (15s & 30s)', 'Static banners', 'Rich media interactive'],
      fatigueRisk: ['Video completion rates may drop after week 6'],
      refreshPlan: ['New video cut at week 4', 'Seasonal overlay at week 8'],
    },
  },
  {
    id: 'demo-bp-product',
    name: 'Product V2 Launch — Aggressive',
    variant: 'aggressive' as const,
    confidence: 'Medium' as const,
    channels: ['Meta', 'Google', 'LinkedIn', 'TikTok'],
    channelAllocations: [
      { name: 'Meta Ads', budgetPercent: 35, budgetAmount: '$42,000', role: 'Broad awareness + retargeting', formats: ['Video', 'Carousel', 'Lead Forms'] },
      { name: 'Google Ads', budgetPercent: 30, budgetAmount: '$36,000', role: 'Search capture + YouTube', formats: ['Search', 'YouTube Pre-roll', 'Discovery'] },
      { name: 'LinkedIn', budgetPercent: 20, budgetAmount: '$24,000', role: 'B2B decision-makers', formats: ['Sponsored Content', 'Message Ads'] },
      { name: 'TikTok', budgetPercent: 15, budgetAmount: '$18,000', role: 'Viral reach + Gen Z', formats: ['In-Feed', 'TopView'] },
    ],
    audiences: ['Early adopters 25-40', 'Tech-savvy professionals', 'Industry influencers'],
    budget: { amount: '$120,000', pacing: 'Heavy launch week, then sustained' },
    metrics: { reach: '3.8M', ctr: '3.1%', roas: '2.8x', conversions: '15,000' },
    messaging: 'The next generation is here. Faster, smarter, built for what\'s next.',
    cta: 'Get Early Access',
    creativeBrief: {
      primaryAngle: 'Innovation and next-generation capabilities',
      confidence: 'Medium',
      supportingMessages: ['2x faster performance', 'Seamless integration', 'Early adopter exclusive pricing'],
      recommendedFormats: ['Product demo video', 'Feature comparison carousel', 'Testimonial stories'],
      fatigueRisk: ['Launch hype may plateau after week 2'],
      refreshPlan: ['Customer testimonial content at week 3', 'Case study series at week 5'],
    },
  },
];

/** Demo launch config data for seeding into launchConfigStorage */
export const DEMO_LAUNCH_CONFIGS: import('../types/campaignLaunch').SavedLaunchConfig[] = [
  {
    id: 'demo-1',
    name: 'Spring Collection Launch',
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-02-10T14:00:00Z',
    config: {
      campaign: { name: 'Spring Collection Launch', objective: 'OUTCOME_AWARENESS', dailyBudget: 71400, status: 'ACTIVE', specialAdCategories: [], buyingType: 'AUCTION' },
      adSets: [
        { localId: 'demo-as-1', name: 'Fashion Women 25-44', dailyBudget: 35700, optimizationGoal: 'REACH', billingEvent: 'IMPRESSIONS', targeting: { geoLocations: { countries: ['US'] }, ageMin: 25, ageMax: 44 }, status: 'ACTIVE', audienceLabel: 'Fashion-forward women 25-44' },
        { localId: 'demo-as-2', name: 'Previous Customers', dailyBudget: 35700, optimizationGoal: 'REACH', billingEvent: 'IMPRESSIONS', targeting: { geoLocations: { countries: ['US'] }, ageMin: 18, ageMax: 65 }, status: 'ACTIVE', audienceLabel: 'Previous customers' },
      ],
      creatives: [
        { localId: 'demo-cr-1', name: 'Spring Hero', headline: 'Shop the Spring Collection', bodyText: 'Refresh your wardrobe with our new arrivals', ctaType: 'SHOP_NOW', linkUrl: 'https://example.com/spring', pageId: '' },
        { localId: 'demo-cr-2', name: 'New Arrivals Carousel', headline: 'New Arrivals Are Here', bodyText: 'Premium fabrics, modern silhouettes', ctaType: 'LEARN_MORE', linkUrl: 'https://example.com/new', pageId: '' },
      ],
      ads: [
        { localId: 'demo-ad-1', name: 'Spring Hero - Women 25-44', adSetLocalId: 'demo-as-1', creativeLocalId: 'demo-cr-1', status: 'ACTIVE' },
        { localId: 'demo-ad-2', name: 'Carousel - Previous Customers', adSetLocalId: 'demo-as-2', creativeLocalId: 'demo-cr-2', status: 'ACTIVE' },
      ],
      facebookPages: [],
    },
    platformCampaignId: 'demo-meta-spring',
    isEditMode: true,
    programId: 'demo-prog-1',
    channelPlatform: 'meta',
  },
  {
    id: 'demo-2',
    name: 'Brand Awareness Q1',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T14:00:00Z',
    config: {
      campaign: { name: 'Brand Awareness Q1', objective: 'OUTCOME_AWARENESS', dailyBudget: 107100, status: 'ACTIVE', specialAdCategories: [], buyingType: 'AUCTION' },
      adSets: [
        { localId: 'demo-as-3', name: 'Adults 18-54', dailyBudget: 53550, optimizationGoal: 'REACH', billingEvent: 'IMPRESSIONS', targeting: { geoLocations: { countries: ['US'] }, ageMin: 18, ageMax: 54 }, status: 'ACTIVE', audienceLabel: 'Adults 18-54' },
        { localId: 'demo-as-4', name: 'Category Buyers', dailyBudget: 53550, optimizationGoal: 'REACH', billingEvent: 'IMPRESSIONS', targeting: { geoLocations: { countries: ['US'] }, ageMin: 25, ageMax: 55 }, status: 'ACTIVE', audienceLabel: 'Category buyers' },
      ],
      creatives: [
        { localId: 'demo-cr-3', name: 'Brand Trust', headline: 'Quality You Can Trust', bodyText: 'Discover what sets us apart', ctaType: 'LEARN_MORE', linkUrl: 'https://example.com/brand', pageId: '' },
      ],
      ads: [
        { localId: 'demo-ad-3', name: 'Brand Trust - Adults', adSetLocalId: 'demo-as-3', creativeLocalId: 'demo-cr-3', status: 'ACTIVE' },
        { localId: 'demo-ad-4', name: 'Brand Trust - Category', adSetLocalId: 'demo-as-4', creativeLocalId: 'demo-cr-3', status: 'ACTIVE' },
      ],
      facebookPages: [],
    },
    platformCampaignId: 'demo-meta-awareness',
    isEditMode: true,
    programId: 'demo-prog-2',
    channelPlatform: 'meta',
  },
  {
    id: 'demo-3',
    name: 'Product V2 Launch',
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-01T16:00:00Z',
    config: {
      campaign: { name: 'Product V2 Launch', objective: 'OUTCOME_AWARENESS', dailyBudget: 214200, status: 'PAUSED', specialAdCategories: [], buyingType: 'AUCTION' },
      adSets: [
        { localId: 'demo-as-5', name: 'Early Adopters', dailyBudget: 107100, optimizationGoal: 'REACH', billingEvent: 'IMPRESSIONS', targeting: { geoLocations: { countries: ['US'] }, ageMin: 25, ageMax: 40 }, status: 'PAUSED', audienceLabel: 'Early adopters 25-40' },
        { localId: 'demo-as-6', name: 'Tech Professionals', dailyBudget: 107100, optimizationGoal: 'REACH', billingEvent: 'IMPRESSIONS', targeting: { geoLocations: { countries: ['US'] }, ageMin: 28, ageMax: 50 }, status: 'PAUSED', audienceLabel: 'Tech-savvy professionals' },
      ],
      creatives: [
        { localId: 'demo-cr-4', name: 'Product Launch Hero', headline: 'The Next Generation Is Here', bodyText: 'Faster, smarter, built for what\'s next', ctaType: 'LEARN_MORE', linkUrl: 'https://example.com/v2', pageId: '' },
        { localId: 'demo-cr-5', name: 'Feature Comparison', headline: '2x Faster Performance', bodyText: 'See how V2 compares', ctaType: 'LEARN_MORE', linkUrl: 'https://example.com/compare', pageId: '' },
      ],
      ads: [
        { localId: 'demo-ad-5', name: 'Launch Hero - Early Adopters', adSetLocalId: 'demo-as-5', creativeLocalId: 'demo-cr-4', status: 'PAUSED' },
        { localId: 'demo-ad-6', name: 'Comparison - Tech Pros', adSetLocalId: 'demo-as-6', creativeLocalId: 'demo-cr-5', status: 'PAUSED' },
      ],
      facebookPages: [],
    },
    isEditMode: false,
    programId: 'demo-prog-3',
    channelPlatform: 'meta',
  },
];

function buildDemoPrograms(): PaidMediaProgram[] {
  return [
    {
      id: 'demo-prog-1',
      name: 'Spring Collection Launch',
      status: 'launched',
      createdAt: '2026-02-01T10:00:00Z',
      updatedAt: '2026-02-10T14:00:00Z',
      currentStepId: 4,
      furthestCompletedStep: 4,
      steps: [
        { stepId: 1, label: 'Campaign Brief', status: 'completed' },
        { stepId: 2, label: 'Blueprint', status: 'completed' },
        { stepId: 3, label: 'Campaign Configuration', status: 'completed' },
        { stepId: 4, label: 'Review & Launch', status: 'completed' },
      ],
      blueprintIds: ['demo-bp-spring'],
      approvedBlueprintId: 'demo-bp-spring',
      channels: [
        { platform: 'meta', enabled: true, launchConfigIds: ['demo-1'], isConfigured: true },
        { platform: 'google', enabled: true, launchConfigIds: [], isConfigured: true },
        { platform: 'tiktok', enabled: true, launchConfigIds: [], isConfigured: true },
        { platform: 'snapchat', enabled: false, launchConfigIds: [], isConfigured: false },
        { platform: 'pinterest', enabled: false, launchConfigIds: [], isConfigured: false },
      ],
      briefSnapshot: JSON.stringify(DEMO_BRIEF_SPRING),
    },
    {
      id: 'demo-prog-2',
      name: 'Brand Awareness Q1',
      status: 'launched',
      createdAt: '2026-01-10T09:00:00Z',
      updatedAt: '2026-01-15T11:00:00Z',
      currentStepId: 4,
      furthestCompletedStep: 4,
      steps: [
        { stepId: 1, label: 'Campaign Brief', status: 'completed' },
        { stepId: 2, label: 'Blueprint', status: 'completed' },
        { stepId: 3, label: 'Campaign Configuration', status: 'completed' },
        { stepId: 4, label: 'Review & Launch', status: 'completed' },
      ],
      blueprintIds: ['demo-bp-awareness'],
      approvedBlueprintId: 'demo-bp-awareness',
      channels: [
        { platform: 'meta', enabled: true, launchConfigIds: ['demo-2'], isConfigured: true },
        { platform: 'google', enabled: true, launchConfigIds: [], isConfigured: true },
        { platform: 'tiktok', enabled: false, launchConfigIds: [], isConfigured: false },
        { platform: 'snapchat', enabled: false, launchConfigIds: [], isConfigured: false },
        { platform: 'pinterest', enabled: false, launchConfigIds: [], isConfigured: false },
      ],
      briefSnapshot: JSON.stringify(DEMO_BRIEF_AWARENESS),
    },
    {
      id: 'demo-prog-3',
      name: 'Product V2 Launch',
      status: 'ready_to_launch',
      createdAt: '2026-02-20T08:00:00Z',
      updatedAt: '2026-03-01T16:00:00Z',
      currentStepId: 3,
      furthestCompletedStep: 2,
      steps: [
        { stepId: 1, label: 'Campaign Brief', status: 'completed' },
        { stepId: 2, label: 'Blueprint', status: 'completed' },
        { stepId: 3, label: 'Campaign Configuration', status: 'in_progress' },
        { stepId: 4, label: 'Review & Launch', status: 'pending' },
      ],
      blueprintIds: ['demo-bp-product'],
      approvedBlueprintId: 'demo-bp-product',
      channels: [
        { platform: 'meta', enabled: true, launchConfigIds: ['demo-3'], isConfigured: true },
        { platform: 'google', enabled: true, launchConfigIds: [], isConfigured: false },
        { platform: 'tiktok', enabled: true, launchConfigIds: [], isConfigured: false },
        { platform: 'snapchat', enabled: false, launchConfigIds: [], isConfigured: false },
        { platform: 'pinterest', enabled: false, launchConfigIds: [], isConfigured: false },
      ],
      briefSnapshot: JSON.stringify(DEMO_BRIEF_PRODUCT),
    },
    {
      id: 'demo-prog-4',
      name: 'Summer Campaign 2026',
      status: 'draft',
      createdAt: '2026-03-05T10:00:00Z',
      updatedAt: '2026-03-05T10:00:00Z',
      currentStepId: 1,
      furthestCompletedStep: 0,
      steps: [
        { stepId: 1, label: 'Campaign Brief', status: 'in_progress' },
        { stepId: 2, label: 'Blueprint', status: 'pending' },
        { stepId: 3, label: 'Campaign Configuration', status: 'pending' },
        { stepId: 4, label: 'Review & Launch', status: 'pending' },
      ],
      blueprintIds: [],
      channels: [
        { platform: 'meta', enabled: true, launchConfigIds: [], isConfigured: false },
        { platform: 'google', enabled: true, launchConfigIds: [], isConfigured: false },
        { platform: 'tiktok', enabled: true, launchConfigIds: [], isConfigured: false },
        { platform: 'snapchat', enabled: false, launchConfigIds: [], isConfigured: false },
        { platform: 'pinterest', enabled: true, launchConfigIds: [], isConfigured: false },
      ],
      briefSnapshot: JSON.stringify(DEMO_BRIEF_SUMMER),
    },
  ];
}

// ── Store interface ──────────────────────────────────────────────────────────

interface ProgramState {
  programs: PaidMediaProgram[];
  activeProgramId: string | null;
  activeProgram: PaidMediaProgram | null;

  // Load
  loadPrograms: () => void;

  // CRUD
  createProgram: (name: string) => PaidMediaProgram;
  renameProgram: (name: string) => void;
  renameProgramById: (id: string, name: string) => void;
  deleteProgram: (id: string) => void;
  setActiveProgram: (id: string | null) => void;

  // Step tracking
  completeStep: (stepId: ProgramStepId) => void;
  setCurrentStep: (stepId: ProgramStepId) => void;
  markStepEdited: (stepId: ProgramStepId) => void;

  // Artifact linking
  linkBrief: (briefId: string) => void;
  saveBriefSnapshot: (data: unknown) => void;
  linkBlueprints: (ids: string[]) => void;
  approveBlueprint: (id: string) => void;

  // Channel / launch config management
  addLaunchConfig: (platform: ChannelPlatform, configId: string) => void;
  removeLaunchConfig: (platform: ChannelPlatform, configId: string) => void;
  setChannelEnabled: (platform: ChannelPlatform, enabled: boolean) => void;
  setChannelConfigured: (platform: ChannelPlatform, configured: boolean) => void;

  // Status
  updateStatus: (status: ProgramStatus) => void;

  // Chat
  linkChatSession: (sessionId: string, historyKey?: string) => void;

  // Internal
  _persist: () => void;
}

// ── Store ────────────────────────────────────────────────────────────────────

export const useProgramStore = create<ProgramState>((set, get) => ({
  programs: [],
  activeProgramId: null,
  activeProgram: null,

  // ── Load ─────────────────────────────────────────────────────────────────

  loadPrograms: () => {
    // Seed demo programs only if missing (skip redundant writes on every load)
    const existingPrograms = programStorage.listPrograms();
    const existingIds = new Set(existingPrograms.map((p) => p.id));
    const demos = buildDemoPrograms();
    let seeded = false;
    for (const demo of demos) {
      if (!existingIds.has(demo.id)) {
        programStorage.saveProgram(demo);
        seeded = true;
      }
    }

    // Seed demo launch configs only if missing
    const existingConfigs = launchConfigStorage.listConfigs();
    const existingConfigIds = new Set(existingConfigs.map((c) => c.id));
    for (const config of DEMO_LAUNCH_CONFIGS) {
      if (!existingConfigIds.has(config.id)) {
        launchConfigStorage.saveConfig(config);
      }
    }

    // Seed demo blueprints via IPC (async, non-blocking)
    if (window.aiSuites?.blueprints) {
      Promise.resolve().then(async () => {
        try {
          const existing = await window.aiSuites!.blueprints.list();
          const existingBpIds = new Set((existing.data || []).map((b: any) => b.id));
          for (const bp of DEMO_BLUEPRINTS) {
            if (!existingBpIds.has(bp.id)) {
              const now = new Date().toISOString();
              await window.aiSuites!.blueprints.save({ ...bp, createdAt: now, updatedAt: now, version: 1 });
            }
          }
        } catch (e) {
          console.warn('[ProgramStore] Failed to seed demo blueprints:', e);
        }
      });
    }

    const programs = seeded ? programStorage.listPrograms() : existingPrograms;

    // Auto-fix programs whose names are still raw prompts by deriving from briefSnapshot
    let nameFixed = false;
    for (const program of programs) {
      if (!program.briefSnapshot) continue;
      // Skip programs already named meaningfully (created after the fix)
      if (program.name === 'New Campaign' || program.name.length > 40 || /^(extract|create|plan|build|design|make|generate|help|write|draft)\b/i.test(program.name)) {
        const betterName = deriveProgramName(program.briefSnapshot);
        if (betterName && betterName !== program.name) {
          program.name = betterName;
          programStorage.saveProgram(program);
          nameFixed = true;
        }
      }
    }

    set({ programs: nameFixed ? programStorage.listPrograms() : programs });
  },

  // ── CRUD ─────────────────────────────────────────────────────────────────

  createProgram: (name) => {
    const now = new Date().toISOString();
    const program: PaidMediaProgram = {
      id: generateId(),
      name,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      currentStepId: 1,
      furthestCompletedStep: 0,
      steps: defaultSteps(),
      blueprintIds: [],
      channels: defaultChannels(),
    };

    programStorage.saveProgram(program);
    set({
      programs: programStorage.listPrograms(),
      activeProgramId: program.id,
      activeProgram: program,
    });
    return program;
  },

  renameProgram: (name) => {
    const { activeProgram } = get();
    if (!activeProgram) return;

    set({
      activeProgram: { ...activeProgram, name, updatedAt: new Date().toISOString() },
    });
    get()._persist();
  },

  renameProgramById: (id, name) => {
    const program = programStorage.getProgram(id);
    if (!program) return;
    const trimmed = name.trim() || program.name;
    const now = new Date().toISOString();
    program.name = trimmed;
    program.updatedAt = now;
    programStorage.saveProgram(program);

    const { activeProgramId, activeProgram } = get();
    set({
      programs: programStorage.listPrograms(),
      ...(activeProgramId === id && activeProgram
        ? { activeProgram: { ...activeProgram, name: trimmed, updatedAt: now } }
        : {}),
    });
  },

  deleteProgram: (id) => {
    programStorage.deleteProgram(id);
    const { activeProgramId } = get();
    set({
      programs: programStorage.listPrograms(),
      ...(activeProgramId === id ? { activeProgramId: null, activeProgram: null } : {}),
    });
  },

  setActiveProgram: (id) => {
    if (!id) {
      set({ activeProgramId: null, activeProgram: null });
      return;
    }
    const program = programStorage.getProgram(id);
    if (program) {
      set({ activeProgramId: id, activeProgram: program });
    }
  },

  // ── Step tracking ────────────────────────────────────────────────────────

  completeStep: (stepId) => {
    const { activeProgram } = get();
    if (!activeProgram) return;

    const now = new Date().toISOString();
    const steps = activeProgram.steps.map((s) =>
      s.stepId === stepId ? { ...s, status: 'completed' as const, completedAt: now } : s
    );
    const furthest = Math.max(activeProgram.furthestCompletedStep, stepId) as ProgramStepId;

    // Auto-advance current step if completing the current one
    const nextStep = stepId < 4 ? ((stepId + 1) as ProgramStepId) : stepId;
    const currentStepId = activeProgram.currentStepId === stepId ? nextStep : activeProgram.currentStepId;

    // Mark next step as in_progress if pending
    const updatedSteps = steps.map((s) =>
      s.stepId === currentStepId && s.status === 'pending'
        ? { ...s, status: 'in_progress' as const }
        : s
    );

    const status: ProgramStatus = furthest >= 3 ? 'ready_to_launch' : furthest >= 1 ? 'in_progress' : 'draft';

    set({
      activeProgram: {
        ...activeProgram,
        steps: updatedSteps,
        furthestCompletedStep: furthest,
        currentStepId,
        status,
        updatedAt: now,
      },
    });
    get()._persist();
  },

  setCurrentStep: (stepId) => {
    const { activeProgram } = get();
    if (!activeProgram) return;

    const now = new Date().toISOString();

    // Mark the target step as in_progress if it's pending
    const steps = activeProgram.steps.map((s) =>
      s.stepId === stepId && s.status === 'pending'
        ? { ...s, status: 'in_progress' as const }
        : s
    );

    set({
      activeProgram: {
        ...activeProgram,
        currentStepId: stepId,
        steps,
        updatedAt: now,
      },
    });
    get()._persist();
  },

  markStepEdited: (stepId) => {
    const { activeProgram } = get();
    if (!activeProgram) return;

    const now = new Date().toISOString();
    const steps = activeProgram.steps.map((s) =>
      s.stepId === stepId ? { ...s, lastEditedAt: now, status: s.status === 'pending' ? ('in_progress' as const) : s.status } : s
    );

    set({
      activeProgram: { ...activeProgram, steps, updatedAt: now },
    });
    get()._persist();
  },

  // ── Artifact linking ─────────────────────────────────────────────────────

  linkBrief: (briefId) => {
    const { activeProgram } = get();
    if (!activeProgram) return;

    set({
      activeProgram: { ...activeProgram, briefId, updatedAt: new Date().toISOString() },
    });
    get()._persist();
  },

  saveBriefSnapshot: (data) => {
    const { activeProgram } = get();
    if (!activeProgram) return;

    set({
      activeProgram: {
        ...activeProgram,
        briefSnapshot: JSON.stringify(data),
        updatedAt: new Date().toISOString(),
      },
    });
    get()._persist();
  },

  linkBlueprints: (ids) => {
    const { activeProgram } = get();
    if (!activeProgram) return;

    // Merge with existing, deduplicate
    const merged = Array.from(new Set([...activeProgram.blueprintIds, ...ids]));
    set({
      activeProgram: { ...activeProgram, blueprintIds: merged, updatedAt: new Date().toISOString() },
    });
    get()._persist();
  },

  approveBlueprint: (id) => {
    const { activeProgram } = get();
    if (!activeProgram) return;

    set({
      activeProgram: { ...activeProgram, approvedBlueprintId: id, updatedAt: new Date().toISOString() },
    });
    get()._persist();
  },

  // ── Channel / launch config ──────────────────────────────────────────────

  addLaunchConfig: (platform, configId) => {
    const { activeProgram } = get();
    if (!activeProgram) return;

    const channels = activeProgram.channels.map((ch) => {
      if (ch.platform !== platform) return ch;
      if (ch.launchConfigIds.includes(configId)) return ch;
      return {
        ...ch,
        launchConfigIds: [...ch.launchConfigIds, configId],
        isConfigured: true,
      };
    });

    set({
      activeProgram: { ...activeProgram, channels, updatedAt: new Date().toISOString() },
    });
    get()._persist();
  },

  removeLaunchConfig: (platform, configId) => {
    const { activeProgram } = get();
    if (!activeProgram) return;

    const channels = activeProgram.channels.map((ch) => {
      if (ch.platform !== platform) return ch;
      const filtered = ch.launchConfigIds.filter((id) => id !== configId);
      return { ...ch, launchConfigIds: filtered, isConfigured: filtered.length > 0 };
    });

    set({
      activeProgram: { ...activeProgram, channels, updatedAt: new Date().toISOString() },
    });
    get()._persist();
  },

  setChannelEnabled: (platform, enabled) => {
    const { activeProgram } = get();
    if (!activeProgram) return;

    const channels = activeProgram.channels.map((ch) =>
      ch.platform === platform ? { ...ch, enabled } : ch
    );

    set({
      activeProgram: { ...activeProgram, channels, updatedAt: new Date().toISOString() },
    });
    get()._persist();
  },

  setChannelConfigured: (platform, configured) => {
    const { activeProgram } = get();
    if (!activeProgram) return;

    const channels = activeProgram.channels.map((ch) =>
      ch.platform === platform ? { ...ch, isConfigured: configured } : ch
    );

    set({
      activeProgram: { ...activeProgram, channels, updatedAt: new Date().toISOString() },
    });
    get()._persist();
  },

  // ── Status ───────────────────────────────────────────────────────────────

  updateStatus: (status) => {
    const { activeProgram } = get();
    if (!activeProgram) return;

    set({
      activeProgram: { ...activeProgram, status, updatedAt: new Date().toISOString() },
    });
    get()._persist();
  },

  // ── Chat ─────────────────────────────────────────────────────────────────

  linkChatSession: (sessionId, historyKey) => {
    const { activeProgram } = get();
    if (!activeProgram) return;

    set({
      activeProgram: {
        ...activeProgram,
        chatSessionId: sessionId,
        ...(historyKey ? { chatHistoryKey: historyKey } : {}),
        updatedAt: new Date().toISOString(),
      },
    });
    get()._persist();
  },

  // ── Internal ─────────────────────────────────────────────────────────────

  _persist: () => {
    const { activeProgram } = get();
    if (!activeProgram) return;

    programStorage.saveProgram(activeProgram);
    set({ programs: programStorage.listPrograms() });
  },
}));
