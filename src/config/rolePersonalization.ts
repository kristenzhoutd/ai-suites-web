// Role-based personalization config for the Command Center dashboard.
// Maps each onboarding role to default tab, KPI ordering, briefing text,
// section ordering per tab, and contextual insight callouts.

export type TabId = 'orchestration' | 'campaigns' | 'audience' | 'creative';

export interface RoleConfig {
  defaultTab: TabId;
  kpiPriority: string[];
  dailyBriefing: string;
  sectionOrder: {
    orchestration: string[];
    campaigns: string[];
    audience: string[];
    creative: string[];
  };
  insightCallouts: {
    orchestration: string;
    campaigns: string;
    audience: string;
    creative: string;
  };
}

export const rolePersonalizationConfig: Record<string, RoleConfig> = {
  'CMO / VP Marketing': {
    defaultTab: 'orchestration',
    kpiPriority: ['Revenue', 'ROAS', 'Spend / Pacing'],
    dailyBriefing:
      'Portfolio revenue up 12.4% with blended ROAS at 3.8x. Cross-channel spend pacing at 68% — on track for monthly targets.',
    sectionOrder: {
      orchestration: [
        'budget-allocation-shifts',
        'channel-efficiency-table',
        'spend-by-channel',
        'cpa-top-channels',
      ],
      campaigns: [
        'performance-trend',
        'top-performing',
        'type-status-breakdown',
        'bottom-performing',
      ],
      audience: ['roas-comparison-spend-revenue', 'audience-performance-cards'],
      creative: ['format-fatigue', 'top-creatives', 'bubble-chart', 'scale-pause'],
    },
    insightCallouts: {
      orchestration:
        'Your portfolio ROAS improved 15% this week. TikTok and Meta are driving the most efficient spend — consider reallocating from underperforming YouTube campaigns.',
      campaigns:
        'Revenue is concentrated in your top 3 campaigns (68% of total). Two bottom performers are pulling blended ROAS down by 0.4x.',
      audience:
        'High-LTV lookalike audiences are converting at 2.4x the rate of interest-based segments. Expanding to 3% could unlock incremental revenue.',
      creative:
        'Carousel formats outperform static by 1.8x ROAS. Two hero creatives show fatigue — refreshing them could recover $8k+ in weekly revenue.',
    },
  },

  'Marketing Manager': {
    defaultTab: 'orchestration',
    kpiPriority: ['Revenue', 'Conversions', 'ROAS'],
    dailyBriefing:
      '20 active campaigns generating $482k revenue. Conversion volume up 8.2% week-over-week with CPA trending down.',
    sectionOrder: {
      orchestration: [
        'budget-allocation-shifts',
        'spend-by-channel',
        'cpa-top-channels',
        'channel-efficiency-table',
      ],
      campaigns: [
        'performance-trend',
        'type-status-breakdown',
        'top-performing',
        'bottom-performing',
      ],
      audience: ['audience-performance-cards', 'roas-comparison-spend-revenue'],
      creative: ['top-creatives', 'format-fatigue', 'scale-pause', 'bubble-chart'],
    },
    insightCallouts: {
      orchestration:
        'Budget utilization at 68%. Three channels have recommended shifts that could improve blended ROAS by 0.4x.',
      campaigns:
        'Your campaign mix is conversion-heavy (40%). Consider adding awareness campaigns to feed the funnel for next quarter.',
      audience:
        'Retargeting audiences have the highest ROAS but limited scale. Prospecting segments are improving — give them more budget runway.',
      creative:
        'Your top 4 creatives drive 60% of conversions. Two creatives are past 18 days — schedule refreshes to maintain momentum.',
    },
  },

  'Performance Marketer': {
    defaultTab: 'campaigns',
    kpiPriority: ['ROAS', 'CPA', 'Conversions'],
    dailyBriefing:
      'ROAS trending up to 3.8x with CPA at $42 (-5.1%). Two campaigns flagged for rising costs — review bottom performers.',
    sectionOrder: {
      orchestration: [
        'cpa-top-channels',
        'channel-efficiency-table',
        'budget-allocation-shifts',
        'spend-by-channel',
      ],
      campaigns: [
        'top-performing',
        'bottom-performing',
        'performance-trend',
        'type-status-breakdown',
      ],
      audience: ['roas-comparison-spend-revenue', 'audience-performance-cards'],
      creative: ['scale-pause', 'top-creatives', 'format-fatigue', 'bubble-chart'],
    },
    insightCallouts: {
      orchestration:
        'TikTok has the lowest CPA ($28) and highest ROAS (5.2x). Shifting $3k from YouTube could reduce blended CPA by 8%.',
      campaigns:
        'Your top campaign is delivering 5.6x ROAS at $22 CPA. Bottom 3 campaigns have CPA 2x above target — consider pausing or restructuring.',
      audience:
        'Cart abandoner retargeting delivers 5.8x ROAS. Expanding the lookback window from 7 to 14 days could increase audience size 40%.',
      creative:
        '3 creatives are above fatigue threshold. Pausing "Summer Static A" and scaling "Spring Carousel B" could improve CPA by 12%.',
    },
  },

  'Media Buyer': {
    defaultTab: 'orchestration',
    kpiPriority: ['Spend / Pacing', 'CPA', 'ROAS'],
    dailyBriefing:
      'Spend pacing at 68% ($6.8k of $10k daily). Budget shifts recommended: move $3k from YouTube to TikTok for better efficiency.',
    sectionOrder: {
      orchestration: [
        'spend-by-channel',
        'budget-allocation-shifts',
        'cpa-top-channels',
        'channel-efficiency-table',
      ],
      campaigns: [
        'performance-trend',
        'top-performing',
        'bottom-performing',
        'type-status-breakdown',
      ],
      audience: ['roas-comparison-spend-revenue', 'audience-performance-cards'],
      creative: ['format-fatigue', 'scale-pause', 'top-creatives', 'bubble-chart'],
    },
    insightCallouts: {
      orchestration:
        'You have $3.2k unallocated daily budget. Recommended: distribute across TikTok (+$2k) and Google Shopping (+$1.2k) based on efficiency data.',
      campaigns:
        'Spend velocity is high on Meta ($35k) but ROAS is mid-tier (4.1x). TikTok delivers better efficiency per dollar at current scale.',
      audience:
        'High-value audience segments are underfunded — they represent 28% of conversions but only 18% of spend. Rebalancing could lift ROAS 0.3x.',
      creative:
        'Video creatives absorb 45% of spend but fatigue faster. Rotating every 14 days instead of 21 could maintain CTR above 3%.',
    },
  },

  Analyst: {
    defaultTab: 'campaigns',
    kpiPriority: ['Conversions', 'CPA', 'ROAS'],
    dailyBriefing:
      '14-day trend shows ROAS improving from 3.2x to 4.2x. CPA declined 27% over the period. Statistical significance reached on 3 A/B tests.',
    sectionOrder: {
      orchestration: [
        'channel-efficiency-table',
        'cpa-top-channels',
        'budget-allocation-shifts',
        'spend-by-channel',
      ],
      campaigns: [
        'performance-trend',
        'type-status-breakdown',
        'top-performing',
        'bottom-performing',
      ],
      audience: ['roas-comparison-spend-revenue', 'audience-performance-cards'],
      creative: ['bubble-chart', 'format-fatigue', 'top-creatives', 'scale-pause'],
    },
    insightCallouts: {
      orchestration:
        'Channel efficiency data shows TikTok leading at 5.2x ROAS with 4.2% conversion rate. LinkedIn underperforms at 1.7x — review cost structure.',
      campaigns:
        'Conversion volume correlates strongly with spend on Mon-Wed (r=0.87). Weekend campaigns show diminishing returns above $5k daily.',
      audience:
        'Audience overlap between "High LTV Lookalike" and "Cart Abandoners" is 34%. Deduplicating could reduce wasted impressions by ~$2.1k/week.',
      creative:
        'Scatter analysis shows carousel formats cluster in high-ROAS, high-volume quadrant. Static creatives are scattered — consider format consolidation.',
    },
  },
};
