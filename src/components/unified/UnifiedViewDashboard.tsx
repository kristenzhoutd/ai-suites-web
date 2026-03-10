import { useState, useRef, useEffect, useMemo, Fragment } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DollarSign,
  ShoppingCart,
  Target,
  TrendingUp,
  Wallet,
  Lightbulb,
  Check,
  X,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Shuffle,
  Users,
  Palette,
  Clock,
  Sparkles,
  BarChart3,
  Trophy,
  AlertTriangle,
  Zap,
  CheckCircle,
  RefreshCw,
  MessageSquare,
  Send,
  Bot,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  Pause,
  CircleDot,
  ImagePlus,
  Play as PlayIcon,
  Loader2,
  Trash2,
  FileText,
  Plus,
  LayoutGrid,
  Pin,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  ZAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { useOptimizeStore } from '../../stores/optimizeStore';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useProgramStore } from '../../stores/programStore';
import { rolePersonalizationConfig, type TabId } from '../../config/rolePersonalization';
import { usePlatformStore } from '../../stores/platformStore';
import { Button } from '@/design-system';
import CMODashboardView from '../campaigns/CMODashboardView';
import type { AttachedFile } from '../../types/campaign';

// ─── Mock Data ────────────────────────────────────────────────────────────────

// ─── KPI Library Data ──────────────────────────────────────────────────────────

const chartWidgetCategories = [
  {
    name: 'Cross Channel Orchestration',
    widgets: [
      { id: 'budget-allocation-shifts', name: 'Budget Allocation & Shifts', description: 'AI-optimized budget distribution and recommended reallocations', chart: 'bar' as const },
      { id: 'spend-by-channel', name: 'Spend by Channel', description: 'Budget distribution across active channels with pie chart', chart: 'pie' as const },
      { id: 'cpa-top-channels', name: 'CPA & Top Channels', description: 'Cost per acquisition and highest ROAS channels', chart: 'hbar' as const },
      { id: 'channel-efficiency-table', name: 'Channel Efficiency', description: 'Comprehensive performance breakdown across all channels', chart: 'table' as const },
    ],
  },
  {
    name: 'Campaigns',
    widgets: [
      { id: 'performance-trend', name: 'Performance Trend', description: 'Campaign spend, conversions, or ROAS over time', chart: 'area' as const },
      { id: 'type-status-breakdown', name: 'Type & Status Breakdown', description: 'Campaign distribution by type and current status', chart: 'bar' as const },
      { id: 'top-performing', name: 'Top Performing Campaigns', description: 'Highest efficiency campaigns driving best ROAS', chart: 'cards' as const },
      { id: 'bottom-performing', name: 'Bottom Performing', description: 'Underperforming campaigns — candidates for pausing', chart: 'cards' as const },
    ],
  },
  {
    name: 'Audience',
    widgets: [
      { id: 'roas-comparison-spend-revenue', name: 'Audience ROAS & Spend', description: 'ROAS comparison and spend vs revenue by segment', chart: 'bar' as const },
      { id: 'audience-performance-cards', name: 'Audience Performance', description: 'Segment-level performance across campaigns and channels', chart: 'cards' as const },
    ],
  },
  {
    name: 'Creative',
    widgets: [
      { id: 'format-fatigue', name: 'Format Performance & Fatigue', description: 'ROAS by creative type and fatigue lifecycle tracking', chart: 'bar' as const },
      { id: 'top-creatives', name: 'Top Performing Creatives', description: 'Best creatives ranked by ROAS with impressions and CTR', chart: 'cards' as const },
      { id: 'bubble-chart', name: 'Creative Volume vs ROAS', description: 'Bubble chart showing volume, efficiency, and spend', chart: 'scatter' as const },
      { id: 'scale-pause', name: 'Scale Winners & Pause/Refresh', description: 'Actionable creative recommendations', chart: 'cards' as const },
    ],
  },
];

function ChartThumbnail({ type }: { type: 'bar' | 'hbar' | 'area' | 'pie' | 'table' | 'cards' | 'scatter' }) {
  return (
    <div className="w-[72px] h-[56px] flex-shrink-0 bg-emerald-50/50 rounded-lg p-1 pt-2.5">
      <div className="bg-white rounded px-1.5 py-1 shadow-[0_0.5px_1px_rgba(0,0,0,0.05)] h-full flex items-end">
        {type === 'bar' && (
          <svg viewBox="0 0 48 24" className="w-full h-[18px]">
            <rect x="2" y="10" width="6" height="14" rx="1" fill="#3b82f6" opacity={0.7} />
            <rect x="10" y="14" width="6" height="10" rx="1" fill="#93c5fd" opacity={0.7} />
            <rect x="18" y="6" width="6" height="18" rx="1" fill="#3b82f6" opacity={0.7} />
            <rect x="26" y="12" width="6" height="12" rx="1" fill="#93c5fd" opacity={0.7} />
            <rect x="34" y="8" width="6" height="16" rx="1" fill="#3b82f6" opacity={0.7} />
            <rect x="42" y="16" width="6" height="8" rx="1" fill="#93c5fd" opacity={0.7} />
          </svg>
        )}
        {type === 'hbar' && (
          <svg viewBox="0 0 48 24" className="w-full h-[18px]">
            <rect x="0" y="1" width="40" height="4" rx="1" fill="#10b981" opacity={0.6} />
            <rect x="0" y="7" width="32" height="4" rx="1" fill="#10b981" opacity={0.5} />
            <rect x="0" y="13" width="24" height="4" rx="1" fill="#f59e0b" opacity={0.5} />
            <rect x="0" y="19" width="16" height="4" rx="1" fill="#ef4444" opacity={0.5} />
          </svg>
        )}
        {type === 'area' && (
          <svg viewBox="0 0 48 24" className="w-full h-[18px]">
            <defs>
              <linearGradient id="thumb-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <path d="M0 18L6 14L12 16L18 10L24 12L30 6L36 8L42 4L48 6L48 24L0 24Z" fill="url(#thumb-area)" />
            <path d="M0 18L6 14L12 16L18 10L24 12L30 6L36 8L42 4L48 6" fill="none" stroke="#3b82f6" strokeWidth={1.5} strokeLinecap="round" />
          </svg>
        )}
        {type === 'pie' && (
          <svg viewBox="0 0 48 24" className="w-full h-[18px]">
            <circle cx="24" cy="12" r="10" fill="none" stroke="#e5e7eb" strokeWidth={4} />
            <circle cx="24" cy="12" r="10" fill="none" stroke="#3b82f6" strokeWidth={4} strokeDasharray="22 41" strokeDashoffset="0" />
            <circle cx="24" cy="12" r="10" fill="none" stroke="#10b981" strokeWidth={4} strokeDasharray="12 51" strokeDashoffset="-22" />
            <circle cx="24" cy="12" r="10" fill="none" stroke="#ec4899" strokeWidth={4} strokeDasharray="8 55" strokeDashoffset="-34" />
          </svg>
        )}
        {type === 'table' && (
          <svg viewBox="0 0 48 24" className="w-full h-[18px]">
            <rect x="0" y="0" width="48" height="4" rx="0.5" fill="#f3f4f6" />
            <rect x="0" y="6" width="48" height="0.5" fill="#e5e7eb" />
            <rect x="0" y="9" width="48" height="0.5" fill="#e5e7eb" />
            <rect x="0" y="12" width="48" height="0.5" fill="#e5e7eb" />
            <rect x="0" y="15" width="48" height="0.5" fill="#e5e7eb" />
            <rect x="0" y="18" width="48" height="0.5" fill="#e5e7eb" />
            <rect x="1" y="1" width="8" height="2" rx="0.5" fill="#9ca3af" opacity={0.4} />
            <rect x="14" y="1" width="8" height="2" rx="0.5" fill="#9ca3af" opacity={0.4} />
            <rect x="27" y="1" width="8" height="2" rx="0.5" fill="#9ca3af" opacity={0.4} />
            <rect x="40" y="1" width="6" height="2" rx="0.5" fill="#9ca3af" opacity={0.4} />
          </svg>
        )}
        {type === 'cards' && (
          <svg viewBox="0 0 48 24" className="w-full h-[18px]">
            <rect x="0" y="0" width="14" height="22" rx="2" fill="#f9fafb" stroke="#e5e7eb" strokeWidth={0.5} />
            <rect x="17" y="0" width="14" height="22" rx="2" fill="#f9fafb" stroke="#e5e7eb" strokeWidth={0.5} />
            <rect x="34" y="0" width="14" height="22" rx="2" fill="#f9fafb" stroke="#e5e7eb" strokeWidth={0.5} />
            <rect x="2" y="3" width="6" height="1.5" rx="0.5" fill="#9ca3af" opacity={0.5} />
            <rect x="2" y="7" width="10" height="3" rx="0.5" fill="#374151" opacity={0.3} />
            <rect x="19" y="3" width="6" height="1.5" rx="0.5" fill="#9ca3af" opacity={0.5} />
            <rect x="19" y="7" width="10" height="3" rx="0.5" fill="#374151" opacity={0.3} />
            <rect x="36" y="3" width="6" height="1.5" rx="0.5" fill="#9ca3af" opacity={0.5} />
            <rect x="36" y="7" width="10" height="3" rx="0.5" fill="#374151" opacity={0.3} />
          </svg>
        )}
        {type === 'scatter' && (
          <svg viewBox="0 0 48 24" className="w-full h-[18px]">
            <circle cx="8" cy="16" r="3" fill="#10b981" opacity={0.5} />
            <circle cx="16" cy="8" r="4.5" fill="#10b981" opacity={0.5} />
            <circle cx="26" cy="12" r="3.5" fill="#f59e0b" opacity={0.5} />
            <circle cx="34" cy="6" r="2.5" fill="#10b981" opacity={0.5} />
            <circle cx="40" cy="18" r="2" fill="#ef4444" opacity={0.5} />
            <circle cx="20" cy="18" r="2" fill="#f59e0b" opacity={0.5} />
          </svg>
        )}
      </div>
    </div>
  );
}

const kpiLibraryCategories = [
  {
    name: 'Revenue & ROI',
    kpis: [
      { id: 'revenue', name: 'Revenue', description: 'Total revenue generated from ad-driven conversions', preview: { value: '$482,300', change: '+12.3%', up: true, spark: [320,340,360,380,430,460,482] } },
      { id: 'roas', name: 'ROAS', description: 'Return on ad spend — revenue generated per dollar spent', preview: { value: '3.8x', change: '+15.3%', up: true, spark: [2.8,3.0,3.2,3.3,3.5,3.7,3.8] } },
      { id: 'roi', name: 'ROI', description: 'Net profit as a percentage of total investment', preview: { value: '284%', change: '+8.6%', up: true, spark: [220,235,248,255,268,275,284] } },
      { id: 'ltv', name: 'Customer LTV', description: 'Predicted lifetime value of acquired customers', preview: { value: '$1,240', change: '+5.2%', up: true, spark: [1080,1100,1140,1160,1190,1220,1240] } },
      { id: 'aov', name: 'Avg Order Value', description: 'Average revenue per conversion event', preview: { value: '$86', change: '+3.1%', up: true, spark: [78,80,81,83,84,85,86] } },
    ],
  },
  {
    name: 'Cost & Efficiency',
    kpis: [
      { id: 'cpa', name: 'CPA', description: 'Cost per acquisition — average spend to drive one conversion', preview: { value: '$42', change: '-5.1%', up: true, spark: [52,48,46,45,44,43,42] } },
      { id: 'cpc', name: 'CPC', description: 'Cost per click — average spend per ad click', preview: { value: '$1.82', change: '-3.2%', up: true, spark: [2.1,2.0,1.95,1.9,1.88,1.85,1.82] } },
      { id: 'cpm', name: 'CPM', description: 'Cost per 1,000 impressions served', preview: { value: '$8.40', change: '-1.8%', up: true, spark: [9.2,9.0,8.8,8.7,8.6,8.5,8.4] } },
      { id: 'spend', name: 'Total Spend', description: 'Total advertising expenditure across all channels', preview: { value: '$6,800', change: '+4.2%', up: true, spark: [5800,6000,6200,6400,6500,6700,6800] } },
      { id: 'budget-util', name: 'Budget Utilization', description: 'Percentage of allocated budget that has been spent', preview: { value: '73%', change: '+6.0%', up: true, spark: [45,50,55,60,65,70,73] } },
    ],
  },
  {
    name: 'Engagement',
    kpis: [
      { id: 'ctr', name: 'CTR', description: 'Click-through rate — percentage of impressions that result in clicks', preview: { value: '2.4%', change: '+0.3%', up: true, spark: [1.9,2.0,2.1,2.2,2.2,2.3,2.4] } },
      { id: 'impressions', name: 'Impressions', description: 'Total number of times ads were displayed', preview: { value: '5.2M', change: '+18.4%', up: true, spark: [3.8,4.0,4.2,4.5,4.8,5.0,5.2] } },
      { id: 'clicks', name: 'Clicks', description: 'Total number of ad clicks across all campaigns', preview: { value: '124K', change: '+9.8%', up: true, spark: [95,100,105,110,115,120,124] } },
      { id: 'reach', name: 'Reach', description: 'Unique users who saw your ads at least once', preview: { value: '3.1M', change: '+14.2%', up: true, spark: [2.2,2.4,2.6,2.7,2.9,3.0,3.1] } },
      { id: 'frequency', name: 'Frequency', description: 'Average number of times each user saw your ad', preview: { value: '1.7x', change: '-2.1%', up: false, spark: [1.9,1.85,1.8,1.78,1.75,1.72,1.7] } },
    ],
  },
  {
    name: 'Conversion',
    kpis: [
      { id: 'conversions', name: 'Conversions', description: 'Total number of completed conversion events', preview: { value: '18,740', change: '+8.2%', up: true, spark: [14200,15100,16200,17100,17500,18200,18740] } },
      { id: 'conv-rate', name: 'Conversion Rate', description: 'Percentage of clicks that result in conversions', preview: { value: '3.8%', change: '+0.4%', up: true, spark: [3.2,3.3,3.4,3.5,3.6,3.7,3.8] } },
      { id: 'leads', name: 'Leads Generated', description: 'Number of new leads captured through ad campaigns', preview: { value: '2,840', change: '+11.5%', up: true, spark: [2100,2250,2400,2520,2650,2760,2840] } },
      { id: 'cart-abandon', name: 'Cart Abandonment', description: 'Percentage of users who add to cart but don\'t purchase', preview: { value: '34%', change: '-2.8%', up: true, spark: [40,38,37,36,35,35,34] } },
    ],
  },
];

const mockKpiData = [
  {
    id: 'revenue',
    label: 'Revenue',
    value: '$482,300',
    change: +12.4,
    icon: DollarSign,
    format: 'currency',
    sparkline: [
      { v: 320 }, { v: 340 }, { v: 335 }, { v: 360 }, { v: 380 }, { v: 410 }, { v: 430 }, { v: 445 }, { v: 460 }, { v: 482 },
    ],
  },
  {
    id: 'conversions',
    label: 'Conversions',
    value: '18,740',
    change: +8.2,
    icon: ShoppingCart,
    format: 'number',
    sparkline: [
      { v: 14200 }, { v: 14800 }, { v: 15100 }, { v: 15600 }, { v: 16200 }, { v: 16800 }, { v: 17100 }, { v: 17500 }, { v: 18200 }, { v: 18740 },
    ],
  },
  {
    id: 'cpa',
    label: 'CPA',
    value: '$42',
    change: -5.1,
    icon: Target,
    format: 'currency',
    invertColor: true, // lower is better
    sparkline: [
      { v: 52 }, { v: 50 }, { v: 48 }, { v: 47 }, { v: 46 }, { v: 45 }, { v: 44 }, { v: 43 }, { v: 42 }, { v: 42 },
    ],
  },
  {
    id: 'roas',
    label: 'ROAS',
    value: '3.8x',
    change: +15.3,
    icon: TrendingUp,
    format: 'multiplier',
    sparkline: [
      { v: 2.8 }, { v: 2.9 }, { v: 3.0 }, { v: 3.1 }, { v: 3.2 }, { v: 3.3 }, { v: 3.4 }, { v: 3.5 }, { v: 3.7 }, { v: 3.8 },
    ],
  },
  {
    id: 'spend',
    label: 'Spend / Pacing',
    value: '$6,800',
    icon: Wallet,
    format: 'currency',
    pacing: { spent: 6800, budget: 10000 },
  },
];

const mockBudgetAllocationData = [
  { channel: 'Meta', current: 32000, recommended: 35000 },
  { channel: 'Google Search', current: 28000, recommended: 26000 },
  { channel: 'TikTok', current: 18000, recommended: 24000 },
  { channel: 'YouTube', current: 15000, recommended: 12000 },
  { channel: 'Google Shop', current: 10000, recommended: 13000 },
  { channel: 'LinkedIn', current: 6000, recommended: 5000 },
];

const mockChannelPerformanceData = [
  { channel: 'TikTok', cpa: 12.40 },
  { channel: 'Google Shop', cpa: 14.80 },
  { channel: 'Meta Ads', cpa: 18.20 },
  { channel: 'Google Search', cpa: 22.50 },
  { channel: 'YouTube', cpa: 28.10 },
  { channel: 'LinkedIn', cpa: 34.60 },
];

const cpaByChannel = [
  { channel: 'TikTok', cpa: 28, color: '#ec4899' },
  { channel: 'Google Shop', cpa: 32, color: '#f97316' },
  { channel: 'Meta Ads', cpa: 38, color: '#3b82f6' },
  { channel: 'Google Search', cpa: 42, color: '#ef4444' },
  { channel: 'YouTube', cpa: 56, color: '#f43f5e' },
  { channel: 'LinkedIn', cpa: 72, color: '#0077b5' },
];

const mockTopChannels = [
  { name: 'TikTok', roas: 5.2, ctr: 3.8, spend: '$18,000', revenue: '$93,600', trend: 'up' as const },
  { name: 'Meta Ads', roas: 4.1, ctr: 2.9, spend: '$35,000', revenue: '$143,500', trend: 'up' as const },
  { name: 'Google Shop', roas: 3.9, ctr: 4.2, spend: '$8,000', revenue: '$31,200', trend: 'up' as const },
];

const channelEfficiencyTableData = [
  { channel: 'TikTok', spend: '$18,000', revenue: '$93,600', roas: 5.2, cpa: 28, ctr: 3.8, convRate: 4.2, roasBar: 100 },
  { channel: 'Meta Ads', spend: '$35,000', revenue: '$143,500', roas: 4.1, cpa: 38, ctr: 2.9, convRate: 3.1, roasBar: 79 },
  { channel: 'Google Shop', spend: '$8,000', revenue: '$31,200', roas: 3.9, cpa: 32, ctr: 4.2, convRate: 5.1, roasBar: 75 },
  { channel: 'Google Search', spend: '$28,000', revenue: '$84,000', roas: 3.0, cpa: 42, ctr: 2.1, convRate: 2.8, roasBar: 58 },
  { channel: 'YouTube', spend: '$15,000', revenue: '$33,000', roas: 2.2, cpa: 56, ctr: 1.4, convRate: 1.9, roasBar: 42 },
  { channel: 'LinkedIn', spend: '$5,000', revenue: '$8,500', roas: 1.7, cpa: 72, ctr: 0.8, convRate: 1.2, roasBar: 33 },
];

const aiRecommendationsPool = [
  {
    title: 'Audience Expansion',
    description: 'Expand TikTok lookalike audiences to 3% from 1%. Data suggests broader targeting yields 18% lower CPA with minimal drop in conversion quality.',
    impact: 'Est. +$12,400 revenue',
    icon: '👥',
    goalTag: 'Audience targeting',
  },
  {
    title: 'Creative Refresh',
    description: 'YouTube ad creatives show fatigue signals. Click-through rate dropped 23% over 14 days. Recommend refreshing top 3 creatives.',
    impact: 'Est. +8% CTR recovery',
    icon: '🎨',
    goalTag: 'Creative performance',
  },
  {
    title: 'Dayparting Strategy',
    description: 'Meta campaigns perform 34% better between 6-9 PM. Shift 40% of budget to evening hours for improved ROAS.',
    impact: 'Est. +0.6 ROAS lift',
    icon: '⏰',
    goalTag: 'Budget optimization',
  },
  {
    title: 'Cross-Channel Attribution',
    description: 'Users who see ads on both Meta and Google convert at 2.4x the rate of single-channel exposure. Consider coordinated frequency caps.',
    impact: 'Est. +22% conversion lift',
    icon: '🔗',
    goalTag: 'Cross-channel insights',
  },
  {
    title: 'Weekly Performance Report',
    description: 'Auto-generate a weekly performance digest with channel-level ROAS, CPA trends, and budget pacing alerts sent to your inbox every Monday.',
    impact: 'Save 3+ hrs/week on reporting',
    icon: '📊',
    goalTag: 'Reporting & analytics',
  },
];

const campaignPerformanceTrend = [
  { day: 'Feb 7', roas: 3.2, cpa: 44, conversions: 820, spend: 36080 },
  { day: 'Feb 8', roas: 3.4, cpa: 41, conversions: 880, spend: 36080 },
  { day: 'Feb 9', roas: 3.1, cpa: 46, conversions: 760, spend: 34960 },
  { day: 'Feb 10', roas: 3.6, cpa: 38, conversions: 950, spend: 36100 },
  { day: 'Feb 11', roas: 3.5, cpa: 39, conversions: 910, spend: 35490 },
  { day: 'Feb 12', roas: 3.8, cpa: 36, conversions: 1020, spend: 36720 },
  { day: 'Feb 13', roas: 3.3, cpa: 42, conversions: 840, spend: 35280 },
  { day: 'Feb 14', roas: 3.9, cpa: 35, conversions: 1080, spend: 37800 },
  { day: 'Feb 15', roas: 4.1, cpa: 33, conversions: 1150, spend: 37950 },
  { day: 'Feb 16', roas: 3.7, cpa: 37, conversions: 980, spend: 36260 },
  { day: 'Feb 17', roas: 4.0, cpa: 34, conversions: 1120, spend: 38080 },
  { day: 'Feb 18', roas: 3.8, cpa: 36, conversions: 1040, spend: 37440 },
  { day: 'Feb 19', roas: 4.2, cpa: 32, conversions: 1180, spend: 37760 },
  { day: 'Feb 20', roas: 3.9, cpa: 35, conversions: 1100, spend: 38500 },
];

const campaignTypeBreakdown = [
  { name: 'Awareness', value: 5, color: '#3b82f6' },
  { name: 'Conversion', value: 8, color: '#10b981' },
  { name: 'Retargeting', value: 4, color: '#f59e0b' },
  { name: 'Engagement', value: 3, color: '#8b5cf6' },
];

const campaignStatusBreakdown = [
  { name: 'Active', value: 12, color: '#10b981' },
  { name: 'Paused', value: 4, color: '#f59e0b' },
  { name: 'Draft', value: 2, color: '#9ca3af' },
  { name: 'Scheduled', value: 2, color: '#3b82f6' },
];

interface BudgetShift {
  id: string;
  from: string;
  to: string;
  amount: number;
  rationale: string;
}

interface StrategyRecommendation {
  id: string;
  title: string;
  description: string;
  impact: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  accentColor: string;
}

const strategyRecommendations: StrategyRecommendation[] = [
  {
    id: 'strat-1',
    title: 'Audience Expansion',
    description:
      'Expand lookalike audiences on Meta from 1% to 3% to capture high-intent users currently outside your targeting. Data shows a 2.1x conversion lift in the 2-3% band.',
    impact: '+12% reach, +8% conversions',
    icon: Users,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-500',
    accentColor: 'border-l-purple-400',
  },
  {
    id: 'strat-2',
    title: 'Creative Refresh',
    description:
      'Rotate creative assets on TikTok and YouTube. Current top creatives have been running 18+ days and CTR has declined 22%. Fresh variants typically recover performance within 3 days.',
    impact: '+15% CTR, -12% CPA',
    icon: Palette,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    accentColor: 'border-l-amber-400',
  },
  {
    id: 'strat-3',
    title: 'Dayparting Strategy',
    description:
      'Focus 60% of spend during peak conversion hours (6–11 PM). Analysis shows 72% of purchases occur in this window but only 40% of current budget is allocated there.',
    impact: '+0.4x ROAS, -8% wasted spend',
    icon: Clock,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    accentColor: 'border-l-emerald-400',
  },
];

interface ChannelEfficiency {
  channel: string;
  spend: number;
  revenue: number;
  roas: number;
  cpa: number;
  ctr: number;
  convRate: number;
  color: string;
}

const channelEfficiencyData: ChannelEfficiency[] = [
  { channel: 'Meta Ads',       spend: 32000, revenue: 112000, roas: 3.5, cpa: 18.20, ctr: 2.8, convRate: 4.2, color: '#3b82f6' },
  { channel: 'Google Search',  spend: 28000, revenue: 89600,  roas: 3.2, cpa: 22.50, ctr: 3.1, convRate: 3.8, color: '#f59e0b' },
  { channel: 'TikTok',         spend: 18000, revenue: 75600,  roas: 4.2, cpa: 12.40, ctr: 3.8, convRate: 5.1, color: '#10b981' },
  { channel: 'YouTube',        spend: 15000, revenue: 39000,  roas: 2.6, cpa: 28.10, ctr: 1.4, convRate: 2.2, color: '#ef4444' },
  { channel: 'Google Shop',    spend: 10000, revenue: 39000,  roas: 3.9, cpa: 14.80, ctr: 2.1, convRate: 4.6, color: '#8b5cf6' },
  { channel: 'LinkedIn',       spend: 6000,  revenue: 13800,  roas: 2.3, cpa: 34.60, ctr: 0.9, convRate: 1.8, color: '#6366f1' },
];

const channelSpendData = [
  { channel: 'Meta', spend: 14200, color: '#3b82f6' },
  { channel: 'Google', spend: 5800, color: '#ef4444' },
  { channel: 'LinkedIn', spend: 4200, color: '#0077b5' },
  { channel: 'TikTok', spend: 3200, color: '#ec4899' },
];

const budgetData = [
  { channel: 'Meta', current: 35000, recommended: 38000 },
  { channel: 'Google Search', current: 28000, recommended: 25000 },
  { channel: 'TikTok', current: 18000, recommended: 24000 },
  { channel: 'YouTube', current: 15000, recommended: 12000 },
  { channel: 'Google Shop', current: 8000, recommended: 11000 },
  { channel: 'LinkedIn', current: 5000, recommended: 5000 },
];

const budgetShifts = [
  { from: 'YouTube', to: 'TikTok', amount: 3000, reason: 'Higher engagement rate with target demographic' },
  { from: 'Google Search', to: 'Google Shop', amount: 2000, reason: 'Better ROAS on shopping campaigns' },
  { from: 'LinkedIn', to: 'Meta', amount: 1000, reason: 'Lower CPA on lookalike audiences' },
  { from: 'YouTube', to: 'TikTok', amount: 3000, reason: 'Video completion rates 2.3x higher' },
];

function getRoasColor(roas: number) {
  if (roas >= 4.0) return 'text-emerald-600 bg-emerald-50';
  if (roas >= 3.0) return 'text-blue-600 bg-blue-50';
  if (roas >= 2.5) return 'text-amber-600 bg-amber-50';
  return 'text-red-600 bg-red-50';
}

function getCpaColor(cpa: number) {
  if (cpa <= 15) return 'text-emerald-600';
  if (cpa <= 22) return 'text-blue-600';
  if (cpa <= 30) return 'text-amber-600';
  return 'text-red-600';
}

interface CampaignPerformance {
  rank: number;
  name: string;
  status: 'Scaling' | 'Stable' | 'Declining' | 'Testing' | 'Paused';
  type: 'Retargeting' | 'Prospecting' | 'Testing';
  roas: number;
  cpa: number;
  revenue: number;
  trend: number;
  insights: [string, string];
  platform?: 'meta' | 'google' | 'tiktok';
  platformCampaignId?: string;
  id?: string;
  spent?: number;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  ctr?: number;
  budget?: number;
  startDate?: string;
  endDate?: string;
  adGroupCount?: number;
}

const mockTopCampaigns: CampaignPerformance[] = [
  {
    rank: 1,
    name: 'Spring Drop Cart Recovery',
    status: 'Scaling',
    type: 'Retargeting',
    roas: 5.6,
    cpa: 22,
    revenue: 26900,
    trend: +18.3,
    insights: [
      'High-intent traffic converting at 3x above average',
      'Cart abandoners responding well to 24hr retarget window',
    ],
  },
  {
    rank: 2,
    name: 'High LTV Lookalike Expansion (T2)',
    status: 'Scaling',
    type: 'Prospecting',
    roas: 4.1,
    cpa: 35,
    revenue: 25400,
    trend: +10.5,
    insights: [
      'Scalable audience funnel with consistent CPA under $40',
      'Extended lookalike (3-5%) still outperforming interest targets',
    ],
  },
  {
    rank: 3,
    name: 'Evergreen Retargeting — Discovery (25-40)',
    status: 'Stable',
    type: 'Retargeting',
    roas: 3.8,
    cpa: 40,
    revenue: 13300,
    trend: +5.2,
    insights: [
      'Mid-funnel awareness driving steady conversion volume',
      'Bounce-rate retargeting segment outperforming page-view segment',
    ],
  },
];

const mockBottomCampaigns: CampaignPerformance[] = [
  {
    rank: 1,
    name: 'Broad Prospecting — Interest Stack (US)',
    status: 'Declining',
    type: 'Prospecting',
    roas: 0.9,
    cpa: 89,
    revenue: 2900,
    trend: -22.0,
    insights: [
      'CPA has doubled over the past 14 days',
      'Audience overlap with 3 other active campaigns detected',
    ],
  },
  {
    rank: 2,
    name: 'B2 Scale Test — S5 LAL Expansion',
    status: 'Testing',
    type: 'Testing',
    roas: 1.2,
    cpa: 72,
    revenue: 2500,
    trend: -15.0,
    insights: [
      'Volatile CPA — insufficient data for stable optimization',
      'Lookalike seed audience too broad (>50k source)',
    ],
  },
  {
    rank: 3,
    name: 'Evergreen Retargeting — Cold (18-25)',
    status: 'Declining',
    type: 'Retargeting',
    roas: 1.5,
    cpa: 65,
    revenue: 2700,
    trend: -8.0,
    insights: [
      'Audience fatigue — frequency at 8.2x over 7 days',
      'Creative has been running unchanged for 30+ days',
    ],
  },
];

interface AudienceSegment {
  id: string;
  demo: string;
  roas: number;
  spend: number;
  revenue: number;
  conversions: number;
  trend: number;
  topChannel: string;
  campaignCount: number;
  insight: string;
}

const audienceSegments: AudienceSegment[] = [
  {
    id: 'aud-1',
    demo: 'Female, 25-34, Urban',
    roas: 5.2,
    spend: 24600,
    revenue: 127900,
    conversions: 4320,
    trend: +12.4,
    topChannel: 'Meta Ads',
    campaignCount: 4,
    insight: 'Strongest ROAS segment across all channels. Meta retargeting + TikTok prospecting driving majority of conversions.',
  },
  {
    id: 'aud-2',
    demo: 'Male, 25-34, Urban',
    roas: 4.0,
    spend: 24600,
    revenue: 47200,
    conversions: 1925,
    trend: +8.2,
    topChannel: 'TikTok',
    campaignCount: 3,
    insight: 'High volume segment. TikTok UGC campaigns outperforming Meta by 1.4x on this demographic.',
  },
  {
    id: 'aud-3',
    demo: 'Female, 35-44, Suburban',
    roas: 4.1,
    spend: 9500,
    revenue: 39000,
    conversions: 1420,
    trend: +5.7,
    topChannel: 'Google Shopping',
    campaignCount: 2,
    insight: 'Search-dominant segment. Google Shopping is capturing 78% of conversions for this cohort.',
  },
  {
    id: 'aud-4',
    demo: 'Male, 35-44, Urban/Metro',
    roas: 3.9,
    spend: 8200,
    revenue: 32000,
    conversions: 1180,
    trend: -2.1,
    topChannel: 'Google Search',
    campaignCount: 3,
    insight: 'Slight decline as LinkedIn B2B campaigns underperform. Google Search remains strong at 4.8x.',
  },
  {
    id: 'aud-5',
    demo: 'Female, 18-24, Urban',
    roas: 3.4,
    spend: 7800,
    revenue: 26500,
    conversions: 1650,
    trend: +15.8,
    topChannel: 'TikTok',
    campaignCount: 4,
    insight: 'Fastest growing segment with high engagement but lower AOV. Upsize creative recommended.',
  },
  {
    id: 'aud-6',
    demo: 'Male, 18-24, Urban',
    roas: 2.8,
    spend: 6500,
    revenue: 18200,
    conversions: 980,
    trend: -5.3,
    topChannel: 'YouTube',
    campaignCount: 2,
    insight: 'Mobile-first segment with top-funnel skew. Currently testing video vs static creative.',
  },
  {
    id: 'aud-7',
    demo: 'Female, 45-54, Suburban',
    roas: 7.5,
    spend: 4200,
    revenue: 31500,
    conversions: 820,
    trend: +22.0,
    topChannel: 'Google Search',
    campaignCount: 2,
    insight: 'Hidden gem segment. Very high ROAS across Search + Shopping. Low reach — scale carefully.',
  },
  {
    id: 'aud-8',
    demo: 'Male, 45-54, Suburban',
    roas: 3.1,
    spend: 3800,
    revenue: 11800,
    conversions: 410,
    trend: +1.2,
    topChannel: 'Google Search',
    campaignCount: 2,
    insight: 'Desktop-dominant segment. Search intent strong — only channel performing above 2x ROAS.',
  },
];

// Audience chart data transformations
const audienceSpendRevenueData = audienceSegments.map((seg) => ({
  name: seg.demo.split(',').slice(0, 2).join(','),
  spend: seg.spend,
  revenue: seg.revenue,
  roas: seg.roas,
}));

// ─── Creative Data ────────────────────────────────────────────────────────────

const creativeBubbles = [
  { name: 'Summer Vibes Video', impressions: 820000, roas: 6.2, spend: 12000, channel: 'TikTok' },
  { name: 'Product Demo 30s', impressions: 540000, roas: 4.8, spend: 9500, channel: 'YouTube' },
  { name: 'UGC Testimonial', impressions: 680000, roas: 5.5, spend: 8200, channel: 'Meta' },
  { name: 'Carousel Lifestyle', impressions: 420000, roas: 4.1, spend: 7800, channel: 'Meta' },
  { name: 'Search Ad Copy A', impressions: 310000, roas: 3.8, spend: 6400, channel: 'Google' },
  { name: 'Banner 728x90', impressions: 950000, roas: 1.4, spend: 11000, channel: 'Google' },
  { name: 'Pre-Roll 15s', impressions: 620000, roas: 2.1, spend: 8800, channel: 'YouTube' },
  { name: 'Static Promo', impressions: 280000, roas: 1.8, spend: 5200, channel: 'LinkedIn' },
  { name: 'Reels Trend Hook', impressions: 760000, roas: 5.9, spend: 6800, channel: 'TikTok' },
  { name: 'Sponsored Post', impressions: 180000, roas: 1.2, spend: 4500, channel: 'LinkedIn' },
];

const scaleWinners = [
  {
    name: 'Summer Vibes Video',
    channel: 'TikTok',
    format: 'Video 15s',
    roas: 6.2,
    ctr: 4.8,
    spend: '$12,000',
    conversions: '1,840',
    insight: 'UGC-style creative with trending audio. Engagement rate 3.2x above benchmark. Scale budget by 40% to capture remaining addressable audience.',
  },
  {
    name: 'UGC Testimonial',
    channel: 'Meta Ads',
    format: 'Video 30s',
    roas: 5.5,
    ctr: 3.6,
    spend: '$8,200',
    conversions: '1,420',
    insight: 'Authentic testimonial format driving high trust signals. Perform well across 25-44 age segments. Test variations with different testimonial subjects.',
  },
  {
    name: 'Reels Trend Hook',
    channel: 'TikTok',
    format: 'Reel 9:16',
    roas: 5.9,
    ctr: 5.1,
    spend: '$6,800',
    conversions: '1,180',
    insight: 'Hook-first creative pattern with 92% 3-second retention. Trending format drives organic amplification. Duplicate pattern across new product lines.',
  },
];

const pauseRefresh = [
  {
    name: 'Banner 728x90',
    channel: 'Google Display',
    format: 'Static Banner',
    roas: 1.4,
    ctr: 0.3,
    spend: '$11,000',
    conversions: '210',
    recommendation: 'Creative fatigue — CTR dropped 45% over 21 days. Pause immediately and replace with animated HTML5 variant.',
  },
  {
    name: 'Static Promo',
    channel: 'LinkedIn',
    format: 'Single Image',
    roas: 1.8,
    ctr: 0.6,
    spend: '$5,200',
    conversions: '180',
    recommendation: 'Low engagement on professional audience. Test carousel format with case study data points instead of promotional messaging.',
  },
  {
    name: 'Sponsored Post',
    channel: 'LinkedIn',
    format: 'Sponsored Content',
    roas: 1.2,
    ctr: 0.4,
    spend: '$4,500',
    conversions: '95',
    recommendation: 'Lowest performing creative. Audience overlap with Static Promo at 68%. Consolidate budget into better-performing LinkedIn formats.',
  },
];

const creativeFormatPerformance = [
  { format: 'Video', count: 5, avgRoas: 5.3, avgCtr: 3.8, spend: 39300, conversions: 4440 },
  { format: 'Image', count: 3, avgRoas: 1.5, avgCtr: 0.5, spend: 21400, conversions: 485 },
  { format: 'Carousel', count: 2, avgRoas: 4.1, avgCtr: 4.2, spend: 7800, conversions: 1420 },
];

const creativeFatigueTimeline = [
  { name: 'Summer Vibes Video', daysActive: 14, fatigue: 18, status: 'fresh' as const },
  { name: 'UGC Testimonial', daysActive: 21, fatigue: 32, status: 'fresh' as const },
  { name: 'Reels Trend Hook', daysActive: 10, fatigue: 12, status: 'fresh' as const },
  { name: 'Carousel Lifestyle', daysActive: 28, fatigue: 45, status: 'fresh' as const },
  { name: 'Product Demo 30s', daysActive: 35, fatigue: 58, status: 'warning' as const },
  { name: 'Pre-Roll 15s', daysActive: 42, fatigue: 65, status: 'warning' as const },
  { name: 'Banner 728x90', daysActive: 48, fatigue: 82, status: 'danger' as const },
  { name: 'Static Promo', daysActive: 38, fatigue: 71, status: 'danger' as const },
  { name: 'Search Ad Copy A', daysActive: 30, fatigue: 40, status: 'fresh' as const },
  { name: 'Sponsored Post', daysActive: 45, fatigue: 78, status: 'danger' as const },
];

const topCreatives = [
  { name: 'Hero Video - Brand Story', type: 'Video', channel: 'Meta', impressions: '220K', ctr: '3.09%', conversions: 125, roas: 3.8 },
  { name: 'Carousel - Product Features', type: 'Carousel', channel: 'Meta', impressions: '180K', ctr: '2.85%', conversions: 98, roas: 3.4 },
  { name: 'Static - Limited Offer', type: 'Image', channel: 'TikTok', impressions: '95K', ctr: '3.42%', conversions: 72, roas: 3.6 },
  { name: 'Search Ad - Brand Terms', type: 'Text', channel: 'Google', impressions: '340K', ctr: '2.41%', conversions: 105, roas: 2.8 },
];

interface Opportunity {
  id: string;
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  channel: string;
  iconBg: string;
  iconColor: string;
  icon: React.ElementType;
}

const opportunities: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Pause Ad: "Back to Gym — Free Shipping (Video)"',
    description:
      'This ad has a CPA of $89, which is 62% above the account average. CTR has declined 34% over the last 7 days indicating creative fatigue.',
    confidence: 91,
    impact: 'high',
    channel: 'Meta',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
    icon: AlertTriangle,
  },
  {
    id: 'opp-2',
    title: 'Reallocate budget to top-performing campaign',
    description:
      'Spring Drop Cart Recovery is delivering 5.6x ROAS. Shifting $3,000 from underperforming prospecting could yield an estimated $16,800 in additional revenue.',
    confidence: 89,
    impact: 'high',
    channel: 'TikTok',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    icon: Shuffle,
  },
  {
    id: 'opp-3',
    title: 'Exclude recent purchasers from retargeting',
    description:
      '14% of retargeting impressions are being served to users who already converted in the past 7 days. Excluding them could save $1,200/week in wasted spend.',
    confidence: 94,
    impact: 'high',
    channel: 'Google',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    icon: Target,
  },
  {
    id: 'opp-4',
    title: 'Increase Meta Lookalike bid cap by 10%',
    description:
      'Lookalike audiences are converting at 2.1x the rate of interest-based targeting but are losing 30% of auctions due to low bid caps.',
    confidence: 82,
    impact: 'medium',
    channel: 'Meta',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-500',
    icon: TrendingUp,
  },
  {
    id: 'opp-5',
    title: 'Enable dayparting for Meta campaigns',
    description:
      'Conversion data shows 72% of purchases occur between 6pm–11pm. Focusing spend on peak hours could improve ROAS by ~0.4x.',
    confidence: 78,
    impact: 'low',
    channel: 'Meta',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    icon: Clock,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

interface KPICardProps {
  id?: string;
  label: string;
  value: string;
  change?: number;
  icon: React.ElementType;
  invertColor?: boolean;
  pacing?: { spent: number; budget: number };
  sparkline?: { v: number }[];
}

function SectionHeader({ title, subtitle, onAskAI }: { title: string; subtitle?: string; onAskAI?: () => void }) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {onAskAI && (
          <button
            onClick={() => onAskAI()}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
            title="Deep dive with AI"
          >
            <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
}

function KPICardComponent({
  label,
  value,
  change,
  icon: Icon,
  invertColor,
  pacing,
  sparkline,
}: KPICardProps) {
  const isPositive = change !== undefined ? change > 0 : undefined;
  // For metrics where lower is better (like CPA), invert the color logic
  const isGood =
    invertColor !== undefined && change !== undefined
      ? !isPositive
      : isPositive;

  const sparkColor = isGood === undefined ? '#3b82f6' : isGood ? '#10b981' : '#ef4444';

  return (
    <div className="flex-1 min-w-[160px] bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400 font-medium">{label}</span>
        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
          <Icon className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  className={isGood ? 'text-emerald-500' : 'text-red-500'}
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d={isPositive ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
                />
              </svg>
              <span className={`text-xs font-medium ${isGood ? 'text-emerald-500' : 'text-red-500'}`}>
                {change > 0 ? '+' : ''}{change.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        {sparkline && (
          <div className="w-20 h-8">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkline} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
                <defs>
                  <linearGradient id={`sparkGrad-${label.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={sparkColor} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={sparkColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={sparkColor}
                  strokeWidth={1.5}
                  fill={`url(#sparkGrad-${label.replace(/\s+/g, '-')})`}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      {pacing && (
        <div className="mt-2">
          <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
            <span>
              ${pacing.spent.toLocaleString()} / $
              {pacing.budget.toLocaleString()}
            </span>
            <span>{Math.round((pacing.spent / pacing.budget) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{
                width: `${Math.min((pacing.spent / pacing.budget) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function OpportunityCard({
  opportunity,
  onApply,
  onDismiss,
}: {
  opportunity: Opportunity;
  onApply: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const Icon = opportunity.icon;

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      {/* Top row: icon + title + confidence */}
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg ${opportunity.iconBg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-4 h-4 ${opportunity.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <span className="text-[13px] font-semibold text-gray-900 leading-snug">
              {opportunity.title}
            </span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full shrink-0 mt-0.5 font-mono">
              {opportunity.confidence}%
            </span>
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed mt-1.5">
            {expanded ? opportunity.description : opportunity.description.slice(0, 80) + '...'}
          </p>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[11px] text-blue-500 hover:text-blue-700 font-medium bg-transparent border-none cursor-pointer p-0 mt-1"
          >
            {expanded ? 'Hide details' : 'View details'}
          </button>
        </div>
      </div>
      {/* Buttons */}
      <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-50">
        <button
          onClick={() => onDismiss(opportunity.id)}
          className="px-3 py-1.5 text-[11px] font-medium text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border-none cursor-pointer"
        >
          Dismiss
        </button>
        <button
          onClick={() => onApply(opportunity.id)}
          className="px-3 py-1.5 text-[11px] font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors border-none cursor-pointer"
        >
          Review
        </button>
      </div>
    </div>
  );
}

// ─── Chat Panel ──────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  onboardingStep?: 'name' | 'industry' | 'role' | 'goals' | 'keyMetrics';
  options?: string[];
  multiSelect?: boolean;
  textInput?: boolean;
}

const ONBOARDING_STEPS: {
  key: 'name' | 'industry' | 'role' | 'goals' | 'keyMetrics';
  question: string;
  options: string[];
  multi: boolean;
  textInput?: boolean;
}[] = [
  {
    key: 'name',
    question: "Let's personalize your experience! What's your name?",
    options: [],
    multi: false,
    textInput: true,
  },
  {
    key: 'industry',
    question: "Nice to meet you! What industry are you in?",
    options: ['E-commerce', 'SaaS / B2B', 'Finance', 'Healthcare', 'Travel & Hospitality', 'Retail', 'Media & Entertainment', 'Other'],
    multi: false,
  },
  {
    key: 'role',
    question: "Great! And what's your role?",
    options: ['Marketing Manager', 'Performance Marketer', 'Media Buyer', 'CMO / VP Marketing', 'Analyst', 'Other'],
    multi: false,
  },
  {
    key: 'goals',
    question: 'What are your primary goals? (select all that apply)',
    options: ['Budget optimization', 'Creative performance', 'Audience targeting', 'Cross-channel insights', 'Reporting & analytics'],
    multi: true,
  },
  {
    key: 'keyMetrics',
    question: 'Last one — which metrics matter most to you? (select all that apply)',
    options: ['ROAS', 'CPA', 'CTR', 'Conversions', 'Impressions', 'Budget pacing'],
    multi: true,
  },
];

const chatSuggestions = [
  'How are my campaigns performing today?',
  'Which channel should I scale next?',
  'Why is my CPA increasing on Meta?',
  'Recommend budget changes for this week',
];

const chartContextData: Record<string, { message: string; suggestions: string[] }> = {
  'budget-allocation-shifts': {
    message: "I see you're looking at **Budget Allocation**. Meta currently holds the largest share at $32K, but TikTok is showing stronger ROAS efficiency. There are 4 recommended shifts that could improve overall performance.",
    suggestions: ['Why shift budget to TikTok?', 'What\'s the optimal channel split?', 'Show me the projected impact of these shifts'],
  },
  'spend-by-channel': {
    message: "Here's your **Spend by Channel** breakdown. Your spend is distributed across 6 channels with Meta and Google Search taking the majority. Let me know if you'd like to explore reallocation opportunities.",
    suggestions: ['Which channel has the best ROI?', 'Am I overspending on any channel?', 'Compare channel efficiency trends'],
  },
  'cpa-top-channels': {
    message: "Looking at your **Channel Performance Metrics** — TikTok leads with the lowest CPA at $28, while LinkedIn has the highest at $72. Your top 3 channels are all trending upward.",
    suggestions: ['Why is LinkedIn CPA so high?', 'Should I pause underperforming channels?', 'How can I lower CPA on Google?'],
  },
  'channel-efficiency-table': {
    message: "Here's the full **Channel Efficiency** breakdown. TikTok leads in ROAS at 5.2x while LinkedIn trails at 1.7x. I can help identify optimization opportunities across channels.",
    suggestions: ['Rank channels by efficiency', 'Which channels should I scale?', 'What\'s driving the ROAS gap?'],
  },
  'performance-trend': {
    message: "Your **Performance Trend** shows campaign metrics over time. I can help you identify patterns, anomalies, or inflection points in your campaign data.",
    suggestions: ['What caused the recent spike?', 'Are we on track for monthly goals?', 'Compare this month vs last'],
  },
  'type-status-breakdown': {
    message: "Here's your **Campaign Type & Status** overview. I can help you understand how different campaign types are performing relative to each other.",
    suggestions: ['Which campaign type performs best?', 'How many campaigns need attention?', 'Show conversion campaigns breakdown'],
  },
  'top-performing': {
    message: "Your **Top Performing Campaigns** are driving strong results. The leading campaign has a 6.8x ROAS with lookalike audiences on Meta. Want to explore scaling opportunities?",
    suggestions: ['How do I scale the top campaign?', 'What makes these campaigns successful?', 'Can I replicate this for other segments?'],
  },
  'bottom-performing': {
    message: "These **Bottom Performing Campaigns** are candidates for pausing or restructuring. I can help identify what's going wrong and suggest fixes.",
    suggestions: ['Why are these underperforming?', 'Should I pause or optimize them?', 'What budget should I reallocate?'],
  },
  'roas-comparison-spend-revenue': {
    message: "Your **Audience ROAS & Spend** analysis shows significant variation across segments. Some audiences are delivering strong returns while others may need targeting adjustments.",
    suggestions: ['Which audience segment is most profitable?', 'Should I narrow my targeting?', 'Compare audience performance over time'],
  },
  'audience-performance-cards': {
    message: "Here's your **Audience Performance** across all segments. I can help you identify which demographics and interests are driving the best results.",
    suggestions: ['Which audience should I expand?', 'Are there untapped segments?', 'How do lookalikes compare to interest-based?'],
  },
  'format-fatigue': {
    message: "Your **Creative Format Performance** shows varying ROAS across formats, and the **Fatigue Tracker** highlights creatives that may need refreshing. 2 creatives are showing fatigue signals.",
    suggestions: ['Which creatives need refreshing?', 'What format works best for conversions?', 'How often should I rotate creatives?'],
  },
  'top-creatives': {
    message: "Your **Top Performing Creatives** are ranked by ROAS. I can help you understand what's making them effective and how to apply those learnings.",
    suggestions: ['What makes the top creative effective?', 'Should I create variations of winners?', 'Compare creative performance by channel'],
  },
  'bubble-chart': {
    message: "The **Creative Volume vs ROAS** chart shows how each creative balances reach and efficiency. Larger bubbles indicate higher spend allocation.",
    suggestions: ['Which creative has the best reach-to-ROAS ratio?', 'Are high-spend creatives efficient?', 'Identify underperforming high-spend creatives'],
  },
  'scale-pause': {
    message: "Here are your **Scale Winners & Pause/Refresh** recommendations. I've identified creatives worth scaling up and ones that should be paused or refreshed.",
    suggestions: ['Why should I scale these winners?', 'What should replace the paused creatives?', 'Estimated impact of these changes?'],
  },
};

function generateCampaignSummary(store: ReturnType<typeof useOptimizeStore.getState>): string {
  const { campaigns, summary } = store;
  if (campaigns.length === 0) {
    return 'No campaign data available. Connect Meta in Settings to pull live campaign data.';
  }

  const active = campaigns.filter((c) => c.status === 'active');
  const paused = campaigns.filter((c) => c.status === 'paused');

  const parts = [];
  if (active.length > 0) parts.push(`${active.length} active`);
  if (paused.length > 0) parts.push(`${paused.length} paused`);
  const statusStr = parts.length > 0 ? ` (${parts.join(', ')})` : '';

  const lines = [
    `You have **${campaigns.length} campaign${campaigns.length !== 1 ? 's' : ''}** on Meta${statusStr}.`,
    '',
    `Spend: **$${summary.totalSpent.toLocaleString()}** of $${summary.totalBudget.toLocaleString()} budget`,
    `ROAS: **${summary.overallRoas.toFixed(1)}x** blended`,
    `Conversions: **${summary.totalConversions.toLocaleString()}**`,
    '',
  ];

  campaigns.forEach((c) => {
    const icon = c.status === 'active' ? 'Active' : 'Paused';
    const roas = (c.metrics?.roas || 0).toFixed(1);
    const spend = (c.spent || 0).toLocaleString();
    lines.push(`**${c.name}**`);
    lines.push(`${icon} · ROAS ${roas}x · $${spend} spent`);
    lines.push('');
  });

  if (paused.length === campaigns.length) {
    lines.push('All campaigns are currently paused with no delivery. Activate them in Meta Ads Manager to start spending.');
  }

  return lines.join('\n');
}

function generateChannelAnswer(store: ReturnType<typeof useOptimizeStore.getState>): string {
  const { campaigns } = store;
  if (campaigns.length === 0) return 'No campaign data available. Connect Meta to see channel recommendations.';

  const active = campaigns.filter((c) => c.status === 'active');
  if (active.length === 0) {
    const lines = [
      'All campaigns are currently paused — there are no active channels to scale.',
      '',
      'To get started:',
      '1. Activate your campaigns in Meta Ads Manager',
      '2. Run them for at least 7 days to collect data',
      '3. Come back and I can recommend which to scale',
    ];
    return lines.join('\n');
  }

  const sorted = [...active].sort((a, b) => (b.metrics?.roas || 0) - (a.metrics?.roas || 0));
  const top = sorted[0];
  return `Your best performer is **${top.name}** with **${(top.metrics?.roas || 0).toFixed(1)}x ROAS**.\n\nConsider increasing its daily budget by 20-30% incrementally while monitoring CPA.`;
}

function generateCpaAnswer(store: ReturnType<typeof useOptimizeStore.getState>): string {
  const { campaigns } = store;
  if (campaigns.length === 0) return 'No campaign data available to analyze CPA trends.';

  const withSpend = campaigns.filter((c) => (c.spent || 0) > 0);
  if (withSpend.length === 0) {
    return 'None of your campaigns have recorded any spend yet, so there is no CPA data to analyze.\n\nActivate your campaigns and allow them to run before reviewing CPA trends.';
  }

  const avgCpa = withSpend.reduce((s, c) => s + (c.metrics?.cpa || 0), 0) / withSpend.length;
  return `Average CPA across ${withSpend.length} campaign${withSpend.length !== 1 ? 's' : ''} with spend: **$${avgCpa.toFixed(2)}**\n\nCheck ad group-level CPA in Meta Ads Manager to identify which audiences are driving costs up.`;
}

function generateBudgetAnswer(store: ReturnType<typeof useOptimizeStore.getState>): string {
  const { campaigns } = store;
  if (campaigns.length === 0) return 'No campaign data available for budget recommendations.';

  const paused = campaigns.filter((c) => c.status === 'paused');
  if (paused.length === campaigns.length) {
    const lines = [
      'All campaigns are paused — no budget is being spent.',
      '',
      'Before making allocation changes:',
      '1. Decide which campaigns to activate',
      '2. Ensure each has ad groups with targeting and creatives',
      '3. Set daily budgets of at least $20/day per campaign',
      '4. Activate and run for 7+ days before optimizing',
    ];
    return lines.join('\n');
  }

  const active = campaigns.filter((c) => c.status === 'active');
  const sorted = [...active].sort((a, b) => (b.metrics?.roas || 0) - (a.metrics?.roas || 0));
  const lines = [`Based on ${active.length} active campaign${active.length !== 1 ? 's' : ''}:`, ''];
  sorted.forEach((c) => {
    const roas = (c.metrics?.roas || 0).toFixed(1);
    const action = (c.metrics?.roas || 0) >= 3 ? 'Increase budget 20%' : (c.metrics?.roas || 0) >= 1.5 ? 'Hold steady' : 'Reduce or pause';
    lines.push(`**${c.name}** (${roas}x ROAS)`);
    lines.push(`→ ${action}`);
    lines.push('');
  });
  return lines.join('\n');
}

function UnifiedChatPanel({ isOpen, onClose, startOnboarding, pinnedKpis, setPinnedKpis, pinnedWidgets, setPinnedWidgets, chartContext, onClearChartContext }: { isOpen: boolean; onClose: () => void; startOnboarding?: boolean; pinnedKpis: Set<string>; setPinnedKpis: React.Dispatch<React.SetStateAction<Set<string>>>; pinnedWidgets: Set<string>; setPinnedWidgets: React.Dispatch<React.SetStateAction<Set<string>>>; chartContext?: string | null; onClearChartContext?: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm your Paid Media assistant. Ask me anything about your campaign performance, budget allocation, or optimization opportunities.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [panelTab, setPanelTab] = useState<'chat' | 'widget-library'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const storeState = useOptimizeStore();

  // Onboarding state
  const updateProfile = useOnboardingStore((s) => s.updateProfile);
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);
  const resetOnboarding = useOnboardingStore((s) => s.resetOnboarding);
  const [onboardingActive, setOnboardingActive] = useState(false);
  const [onboardingStepIndex, setOnboardingStepIndex] = useState(0);
  const [multiSelections, setMultiSelections] = useState<string[]>([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !onboardingActive) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, onboardingActive]);

  // Show contextual message when a chart sparkle is clicked
  useEffect(() => {
    if (chartContext && isOpen && !onboardingActive) {
      const ctx = chartContextData[chartContext];
      if (ctx) {
        setPanelTab('chat');
        setMessages([
          {
            id: `chart-ctx-${chartContext}`,
            role: 'assistant',
            content: ctx.message,
            timestamp: new Date(),
          },
        ]);
      }
    }
  }, [chartContext, isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Start onboarding when triggered
  useEffect(() => {
    if (startOnboarding && isOpen) {
      resetOnboarding();
      setOnboardingActive(true);
      setOnboardingStepIndex(0);
      setMultiSelections([]);
      const step = ONBOARDING_STEPS[0];
      setMessages([
        {
          id: 'onboarding-0',
          role: 'assistant',
          content: step.question,
          timestamp: new Date(),
          onboardingStep: step.key,
          options: step.options,
          multiSelect: step.multi,
          textInput: step.textInput,
        },
      ]);
    }
  }, [startOnboarding]); // eslint-disable-line react-hooks/exhaustive-deps

  const advanceOnboarding = (nextIndex: number) => {
    if (nextIndex < ONBOARDING_STEPS.length) {
      const step = ONBOARDING_STEPS[nextIndex];
      setOnboardingStepIndex(nextIndex);
      setMultiSelections([]);
      const nextMsg: ChatMessage = {
        id: `onboarding-${nextIndex}`,
        role: 'assistant',
        content: step.question,
        timestamp: new Date(),
        onboardingStep: step.key,
        options: step.options,
        multiSelect: step.multi,
        textInput: step.textInput,
      };
      setMessages((prev) => [...prev, nextMsg]);
    } else {
      // Done
      completeOnboarding();
      setOnboardingActive(false);
      setOnboardingStepIndex(0);
      const doneMsg: ChatMessage = {
        id: 'onboarding-done',
        role: 'assistant',
        content: "You're all set! I've personalized your experience based on your preferences. You can update these anytime by clicking Personalize again.\n\nHow can I help you today?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, doneMsg]);
    }
  };

  const handleOnboardingSelect = (option: string) => {
    const step = ONBOARDING_STEPS[onboardingStepIndex];
    if (step.multi) {
      // Toggle selection
      setMultiSelections((prev) =>
        prev.includes(option) ? prev.filter((v) => v !== option) : [...prev, option]
      );
    } else {
      // Single select: add user message, save, advance
      const userMsg: ChatMessage = {
        id: `user-onboard-${Date.now()}`,
        role: 'user',
        content: option,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      updateProfile({ [step.key]: option });
      advanceOnboarding(onboardingStepIndex + 1);
    }
  };

  const handleMultiContinue = () => {
    if (multiSelections.length === 0) return;
    const step = ONBOARDING_STEPS[onboardingStepIndex];
    const userMsg: ChatMessage = {
      id: `user-onboard-${Date.now()}`,
      role: 'user',
      content: multiSelections.join(', '),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    updateProfile({ [step.key]: multiSelections });
    advanceOnboarding(onboardingStepIndex + 1);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      const attachedFile: AttachedFile = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
      };

      setAttachedFiles((prev) => [...prev, attachedFile]);

      if (file.type === 'application/pdf' && window.aiSuites?.pdf) {
        try {
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
              const result = reader.result as string;
              resolve(result.split(',')[1]);
            };
            reader.onerror = reject;
          });

          const result = await window.aiSuites.pdf.extract(base64, file.name);
          if (result.success && result.text) {
            setAttachedFiles((prev) =>
              prev.map((f) => (f.id === attachedFile.id ? { ...f, base64Data: result.text, preview: `Extracted ${result.text!.length} characters from ${file.name}` } : f))
            );
          }
        } catch (err) {
          console.error('PDF extraction failed:', err);
        }
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSend = (text?: string) => {
    // Handle text input onboarding steps (e.g. name)
    if (onboardingActive) {
      const step = ONBOARDING_STEPS[onboardingStepIndex];
      if (step?.textInput) {
        const value = (text || input).trim();
        if (!value) return;
        const userMsg: ChatMessage = {
          id: `user-onboard-${Date.now()}`,
          role: 'user',
          content: value,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        updateProfile({ [step.key]: value });
        advanceOnboarding(onboardingStepIndex + 1);
      }
      return;
    }
    let messageText = text || input.trim();

    // Append extracted PDF text
    const pdfTexts = attachedFiles
      .filter((f) => f.base64Data)
      .map((f) => `\n\n--- Attached: ${f.name} ---\n${f.base64Data!.substring(0, 5000)}`);

    if (pdfTexts.length > 0) {
      messageText = (messageText || `Please analyze: ${attachedFiles.map((f) => f.name).join(', ')}`) + pdfTexts.join('');
    } else if (!messageText && attachedFiles.length > 0) {
      messageText = `Please analyze: ${attachedFiles.map((f) => f.name).join(', ')}`;
    }

    if (!messageText) return;

    setAttachedFiles([]);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Generate response from real campaign data
    const lowerMsg = messageText.toLowerCase();
    let response: string;

    if (lowerMsg.includes('campaign') && (lowerMsg.includes('perform') || lowerMsg.includes('doing') || lowerMsg.includes('status') || lowerMsg.includes('show') || lowerMsg.includes('running'))) {
      response = generateCampaignSummary(storeState);
    } else if (lowerMsg.includes('scale') || lowerMsg.includes('best channel') || lowerMsg.includes('top channel')) {
      response = generateChannelAnswer(storeState);
    } else if (lowerMsg.includes('cpa') || lowerMsg.includes('cost per')) {
      response = generateCpaAnswer(storeState);
    } else if (lowerMsg.includes('budget') || lowerMsg.includes('allocat') || lowerMsg.includes('recommend')) {
      response = generateBudgetAnswer(storeState);
    } else {
      // Fallback: general summary with real data
      const { campaigns: allCamps, summary: sum } = storeState;
      if (allCamps.length > 0) {
        response = [
          `Based on your current data:`,
          '',
          `**${allCamps.length} campaigns** on Meta`,
          `$${sum.totalSpent.toLocaleString()} total spend`,
          `${sum.overallRoas.toFixed(1)}x blended ROAS`,
          `${sum.totalConversions.toLocaleString()} conversions`,
          '',
          'Would you like me to dive deeper into any specific campaign or metric?',
        ].join('\n');
      } else {
        response = 'I don\'t have live campaign data to answer that.\n\nConnect Meta in Settings to pull real campaign performance. Once connected, I can analyze your campaigns, suggest budget changes, and identify optimization opportunities.';
      }
    }

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 500);
  };

  // Find the last assistant message with options (the active onboarding question)
  const lastOnboardingMsgId = onboardingActive
    ? [...messages].reverse().find((m) => m.role === 'assistant' && m.options)?.id
    : null;

  return (
    <div
      className={`shrink-0 flex flex-col bg-white rounded-l-2xl border-y border-l border-gray-100 overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'w-[380px] opacity-100' : 'w-0 opacity-0 border-0 p-0'
      }`}
    >
      {isOpen && (
        <>
          {/* Header */}
          <div className="shrink-0 px-4 pt-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                <button
                  onClick={() => setPanelTab('chat')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    panelTab === 'chat' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <MessageSquare className="w-3 h-3" />
                  Chat
                </button>
                <button
                  onClick={() => setPanelTab('widget-library')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    panelTab === 'widget-library' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <LayoutGrid className="w-3 h-3" />
                  Widget Library
                </button>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Widget Library */}
          {panelTab === 'widget-library' && (
            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Widget Library</h3>
                <p className="text-xs text-gray-400">Pin KPI cards and charts to customize your dashboard.</p>
              </div>

              {/* KPI Cards section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 rounded-full bg-blue-400" />
                  <h4 className="text-xs font-semibold text-gray-900">KPI Cards</h4>
                </div>
                {kpiLibraryCategories.map((category) => (
                  <div key={category.name} className="mb-3">
                    <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">{category.name}</h4>
                    <div className="space-y-1.5">
                      {category.kpis.map((kpi) => {
                        const isPinned = pinnedKpis.has(kpi.id);
                        const p = kpi.preview;
                        const sparkData = p.spark.map((v) => ({ v }));
                        const sparkColor = p.up ? '#10b981' : '#ef4444';
                        return (
                          <div
                            key={kpi.id}
                            className={`flex items-center gap-3 p-2.5 rounded-xl border transition-colors ${
                              isPinned ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100 hover:border-gray-200'
                            }`}
                          >
                            {/* Mini card thumbnail */}
                            <div className="w-[72px] h-[56px] flex-shrink-0 bg-blue-50/50 rounded-lg p-1 pt-2.5">
                              <div className="bg-white rounded px-1.5 py-1 shadow-[0_0.5px_1px_rgba(0,0,0,0.05)]">
                                <div className="text-[4px] text-gray-300 uppercase tracking-wider leading-none mb-px">{kpi.name}</div>
                                <div className="text-[7px] font-bold text-gray-800 leading-none mb-px">{p.value}</div>
                                <div className="flex items-center gap-px">
                                  <svg className="w-[5px] h-[5px]" viewBox="0 0 12 12" fill="none" stroke={p.up ? '#10b981' : '#ef4444'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                    <path d={p.up ? 'M1 8L4 5L7 7L11 3' : 'M1 4L4 7L7 5L11 9'} />
                                  </svg>
                                  <span className={`text-[3.5px] ${p.up ? 'text-emerald-400' : 'text-red-400'}`}>{p.change} vs last period</span>
                                </div>
                              </div>
                            </div>
                            {/* Name + description */}
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-gray-900">{kpi.name}</div>
                              <div className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{kpi.description}</div>
                            </div>
                            {/* Pin button */}
                            <button
                              onClick={() => {
                                setPinnedKpis((prev) => {
                                  const next = new Set(prev);
                                  if (next.has(kpi.id)) next.delete(kpi.id);
                                  else next.add(kpi.id);
                                  return next;
                                });
                              }}
                              className={`w-6 h-6 flex items-center justify-center rounded-md flex-shrink-0 cursor-pointer transition-colors ${
                                isPinned
                                  ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                  : 'text-gray-300 hover:text-gray-500 hover:bg-gray-100'
                              }`}
                              title={isPinned ? 'Unpin from dashboard' : 'Pin to dashboard'}
                            >
                              <Pin className={`w-3 h-3 ${isPinned ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart Widgets section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 rounded-full bg-emerald-400" />
                  <h4 className="text-xs font-semibold text-gray-900">Charts</h4>
                </div>
                {chartWidgetCategories.map((category) => (
                  <div key={category.name} className="mb-3">
                    <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">{category.name}</h4>
                    <div className="space-y-1.5">
                      {category.widgets.map((widget) => {
                        const isPinned = pinnedWidgets.has(widget.id);
                        return (
                          <div
                            key={widget.id}
                            className={`flex items-center gap-3 p-2.5 rounded-xl border transition-colors ${
                              isPinned ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-100 hover:border-gray-200'
                            }`}
                          >
                            <ChartThumbnail type={widget.chart} />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-gray-900">{widget.name}</div>
                              <div className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{widget.description}</div>
                            </div>
                            <button
                              onClick={() => {
                                setPinnedWidgets((prev) => {
                                  const next = new Set(prev);
                                  if (next.has(widget.id)) next.delete(widget.id);
                                  else next.add(widget.id);
                                  return next;
                                });
                              }}
                              className={`w-6 h-6 flex items-center justify-center rounded-md flex-shrink-0 mt-0.5 cursor-pointer transition-colors ${
                                isPinned
                                  ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                                  : 'text-gray-300 hover:text-gray-500 hover:bg-gray-100'
                              }`}
                              title={isPinned ? 'Unpin from dashboard' : 'Pin to dashboard'}
                            >
                              <Pin className={`w-3 h-3 ${isPinned ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-[10px] text-gray-300 text-center pt-2">
                {pinnedKpis.size} KPI{pinnedKpis.size !== 1 ? 's' : ''} · {pinnedWidgets.size} chart{pinnedWidgets.size !== 1 ? 's' : ''} pinned
              </div>
            </div>
          )}

          {/* Chat Messages */}
          {panelTab === 'chat' && (<>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id}>
                <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[90%] px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-b from-[#4e8ecc] to-[#487ec2] text-white rounded-tl-[24px] rounded-tr-[24px] rounded-bl-[24px]'
                        : 'text-gray-700'
                    }`}
                  >
                    {msg.content.split('\n').map((line, i) => (
                      <p key={i} className="m-0 mb-1 last:mb-0" dangerouslySetInnerHTML={{
                        __html: line
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em>$1</em>')
                      }} />
                    ))}
                  </div>
                </div>
                {/* Option chips for active onboarding question */}
                {msg.options && msg.options.length > 0 && msg.id === lastOnboardingMsgId && (
                  <div className="mt-2 ml-0">
                    <div className="flex flex-wrap gap-1.5">
                      {msg.options.map((option) => {
                        const isSelected = msg.multiSelect && multiSelections.includes(option);
                        return (
                          <button
                            key={option}
                            onClick={() => handleOnboardingSelect(option)}
                            className={`px-3 py-1.5 rounded-full text-[12px] transition-all cursor-pointer border ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:text-blue-600'
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                    {msg.multiSelect && (
                      <button
                        onClick={handleMultiContinue}
                        disabled={multiSelections.length === 0}
                        className={`mt-2 px-4 py-1.5 rounded-full text-[12px] font-medium transition-all cursor-pointer border-none ${
                          multiSelections.length > 0
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        }`}
                      >
                        Continue
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions (only show when few messages and not in onboarding) */}
          {messages.length <= 1 && !onboardingActive && (
            <div className="shrink-0 px-5 pb-2">
              <div className="flex flex-wrap gap-1.5">
                {(chartContext && chartContextData[chartContext]
                  ? chartContextData[chartContext].suggestions
                  : chatSuggestions
                ).map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => { handleSend(suggestion); onClearChartContext?.(); }}
                    className="text-[11px] text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer border-none font-medium"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="shrink-0 p-4">
            {onboardingActive ? (
              ONBOARDING_STEPS[onboardingStepIndex]?.textInput ? (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    placeholder="Type your name..."
                    className="w-full px-4 py-3 text-sm text-gray-700 placeholder-gray-400 border-none outline-none bg-transparent"
                    autoFocus
                  />
                  <div className="px-3 py-2 flex items-center justify-end">
                    <button
                      onClick={() => handleSend()}
                      disabled={!input.trim()}
                      className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors border-none"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-[12px] text-gray-400 py-2">
                  Select an option above to continue
                </div>
              )
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {/* Attached Files */}
                {attachedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 px-4 pt-3">
                    {attachedFiles.map((file) => (
                      <div key={file.id} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                        <FileText className="w-3.5 h-3.5" />
                        <span className="max-w-[150px] truncate">{file.name}</span>
                        <span className="text-xs text-gray-400">{formatFileSize(file.size)}</span>
                        <button
                          onClick={() => handleRemoveFile(file.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder="Ask about your campaigns..."
                  className="w-full px-4 py-3 text-sm text-gray-700 placeholder-gray-400 border-none outline-none bg-transparent"
                  disabled={isTyping}
                />
                <div className="px-3 py-2 flex items-center justify-between">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full border border-gray-200 cursor-pointer transition-colors"
                    title="Attach file"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.csv,.png,.jpg,.jpeg"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={(!input.trim() && attachedFiles.length === 0) || isTyping}
                    className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors border-none"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
          </>)}
        </>
      )}
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime()) || d.getFullYear() < 2000) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function mapCampaignStatus(status: string): CampaignPerformance['status'] {
  switch (status) {
    case 'active': return 'Scaling';
    case 'paused': return 'Paused';
    case 'completed': return 'Stable';
    case 'scheduled': return 'Testing';
    default: return 'Stable';
  }
}

function getStatusPillStyle(status: CampaignPerformance['status']): string {
  switch (status) {
    case 'Scaling': return 'bg-emerald-50 text-emerald-700';
    case 'Paused': return 'bg-gray-100 text-gray-600';
    case 'Declining': return 'bg-red-50 text-red-700';
    case 'Testing': return 'bg-amber-50 text-amber-700';
    case 'Stable': return 'bg-blue-50 text-blue-700';
    default: return 'bg-gray-100 text-gray-600';
  }
}

function getStatusIcon(status: CampaignPerformance['status']): React.ReactNode {
  if (status === 'Paused') return <Pause className="w-2.5 h-2.5" />;
  return null;
}

function getPlatformLabel(platform?: string): { label: string; bg: string } | null {
  switch (platform) {
    case 'meta': return { label: 'Meta', bg: 'bg-blue-50 text-blue-600' };
    case 'google': return { label: 'Google', bg: 'bg-amber-50 text-amber-600' };
    case 'tiktok': return { label: 'TikTok', bg: 'bg-gray-900 text-white' };
    default: return null;
  }
}

function getMetaAdsUrl(platformCampaignId?: string): string | null {
  if (!platformCampaignId) return null;
  const metaConn = usePlatformStore.getState().connections.find((c) => c.platform === 'meta');
  const actId = metaConn?.accountId?.replace(/^act_/, '') || '';
  const bizId = metaConn?.businessId || '';
  if (!actId) return `https://www.facebook.com/adsmanager/manage/campaigns?campaign_ids=${platformCampaignId}`;
  return `https://adsmanager.facebook.com/adsmanager/manage/campaigns?${bizId ? `global_scope_id=${bizId}&business_id=${bizId}&` : ''}act=${actId}&selected_campaign_ids=${platformCampaignId}`;
}

interface RecommendationAction {
  label: string;
  type: 'link' | 'api' | 'form';
  url?: string;
  apiParams?: { status?: string; dailyBudget?: number };
  formType?: 'create-adset';
}

interface Recommendation {
  id: string;
  severity: 'critical' | 'warning' | 'suggestion' | 'success';
  title: string;
  description: string;
  icon: React.ElementType;
  action?: RecommendationAction;
}

function generateRecommendations(c: CampaignPerformance): Recommendation[] {
  const recs: Recommendation[] = [];
  const isPaused = c.status === 'Paused';
  const hasNoSpend = !c.spent || c.spent === 0;
  const hasNoImpressions = !c.impressions || c.impressions === 0;
  const hasNoAdGroups = c.adGroupCount === 0 || c.adGroupCount === undefined;
  const hasNoConversions = !c.conversions || c.conversions === 0;
  const lowBudget = (c.budget || 0) > 0 && (c.budget || 0) < 10;
  const lowRoas = c.roas > 0 && c.roas < 2;
  const highCpa = c.cpa > 50;
  const lowCtr = (c.ctr || 0) > 0 && (c.ctr || 0) < 1;

  const hasCampaignId = !!c.platformCampaignId;

  // ── Critical: campaign can't run ──
  if (hasNoAdGroups) {
    recs.push({
      id: 'no-ad-groups',
      severity: 'critical',
      title: 'Create ad groups',
      description: 'This campaign has no ad groups. Create at least one ad group with targeting, budget, and schedule before the campaign can deliver.',
      icon: CircleDot,
      action: hasCampaignId ? { label: 'Create Ad Group', type: 'form', formType: 'create-adset' } : undefined,
    });
  }

  if (hasNoAdGroups || (hasNoImpressions && isPaused)) {
    recs.push({
      id: 'add-ads',
      severity: 'critical',
      title: 'Add ad creatives',
      description: 'Each ad group needs at least one ad with creative (image, video, or carousel) and copy. Upload creatives and write ad copy before activating.',
      icon: ImagePlus,
      action: hasCampaignId ? { label: 'Pause Until Ready', type: 'api', apiParams: { status: 'PAUSED' } } : undefined,
    });
  }

  if (lowBudget) {
    recs.push({
      id: 'low-budget',
      severity: 'critical',
      title: 'Increase daily budget',
      description: `Current daily budget is $${(c.budget || 0).toFixed(2)}. Meta recommends at least $20/day for the algorithm to optimize delivery effectively.`,
      icon: Wallet,
      action: hasCampaignId ? { label: 'Set to $20/day', type: 'api', apiParams: { dailyBudget: 2000 } } : undefined,
    });
  }

  // ── Paused-specific ──
  if (isPaused && hasNoSpend) {
    recs.push({
      id: 'never-ran',
      severity: 'warning',
      title: 'Campaign has never run',
      description: 'This campaign was created but never activated. Review ad groups, targeting, and creatives, then set status to Active when ready to launch.',
      icon: PlayIcon,
      action: hasCampaignId ? { label: 'Activate Campaign', type: 'api', apiParams: { status: 'ACTIVE' } } : undefined,
    });
  } else if (isPaused && !hasNoSpend) {
    recs.push({
      id: 'paused-with-data',
      severity: 'warning',
      title: 'Campaign is paused',
      description: `This campaign was paused after spending $${(c.spent || 0).toLocaleString()}. Review performance data to decide whether to resume, adjust targeting, or reallocate budget.`,
      icon: Pause,
      action: hasCampaignId ? { label: 'Resume Campaign', type: 'api', apiParams: { status: 'ACTIVE' } } : undefined,
    });
  }

  // ── Performance warnings ──
  if (lowRoas && !hasNoSpend) {
    recs.push({
      id: 'low-roas',
      severity: 'warning',
      title: 'Low ROAS — review efficiency',
      description: `ROAS is ${c.roas.toFixed(1)}x, below the 2.0x break-even threshold. Consider narrowing audience targeting, testing new creatives, or pausing underperforming ad groups.`,
      icon: TrendingUp,
      action: hasCampaignId ? { label: 'Pause Campaign', type: 'api', apiParams: { status: 'PAUSED' } } : undefined,
    });
  }

  if (highCpa && !hasNoSpend) {
    recs.push({
      id: 'high-cpa',
      severity: 'warning',
      title: 'High CPA — optimize conversion path',
      description: `CPA is $${c.cpa.toFixed(0)}, which is above target. Review your conversion event setup, landing page experience, and audience quality.`,
      icon: Target,
      action: hasCampaignId ? { label: 'Pause Campaign', type: 'api', apiParams: { status: 'PAUSED' } } : undefined,
    });
  }

  if (lowCtr && !hasNoSpend) {
    recs.push({
      id: 'low-ctr',
      severity: 'warning',
      title: 'Low CTR — refresh creative',
      description: `CTR is ${(c.ctr || 0).toFixed(2)}%, below the 1% benchmark. Test new ad copy, headlines, and visuals. Video and carousel formats typically outperform static images.`,
      icon: Palette,
      action: hasCampaignId ? { label: 'Pause Campaign', type: 'api', apiParams: { status: 'PAUSED' } } : undefined,
    });
  }

  if (hasNoConversions && !hasNoSpend) {
    recs.push({
      id: 'no-conversions',
      severity: 'warning',
      title: 'No conversions recorded',
      description: 'This campaign has spend but zero conversions. The Meta Pixel or conversion event may not be configured correctly. Pausing will stop wasted spend.',
      icon: AlertTriangle,
      action: hasCampaignId ? { label: 'Pause Campaign', type: 'api', apiParams: { status: 'PAUSED' } } : undefined,
    });
  }

  // ── Suggestions for improvement ──
  if (!hasNoSpend && c.roas >= 3) {
    const newBudgetCents = Math.round((c.budget || 20) * 1.2 * 100);
    recs.push({
      id: 'scale-opportunity',
      severity: 'success',
      title: 'Strong performer — consider scaling',
      description: `ROAS of ${c.roas.toFixed(1)}x is well above target. Increasing daily budget by 20% to $${((c.budget || 20) * 1.2).toFixed(0)}/day could capture more conversions without disrupting the algorithm.`,
      icon: TrendingUp,
      action: hasCampaignId ? { label: 'Increase Budget 20%', type: 'api', apiParams: { dailyBudget: newBudgetCents } } : undefined,
    });
  }

  if ((c.adGroupCount || 0) === 1 && !hasNoSpend) {
    recs.push({
      id: 'single-adgroup',
      severity: 'suggestion',
      title: 'Test multiple ad groups',
      description: 'Running a single ad group limits optimization. Create 2–3 ad groups with different audience segments or creative strategies to let the algorithm find the best performers.',
      icon: Users,
    });
  }

  recs.push({
    id: 'conversion-tracking',
    severity: 'suggestion',
    title: 'Verify conversion tracking',
    description: 'Ensure Meta Pixel, Conversions API (CAPI), and domain verification are set up. Proper server-side tracking improves attribution accuracy and campaign optimization.',
    icon: CheckCircle,
  });

  return recs;
}

// ─── Campaign Detail Drawer ──────────────────────────────────────────────────

function CampaignDetailDrawer({
  campaign,
  onClose,
  onCampaignUpdated,
}: {
  campaign: CampaignPerformance | null;
  onClose: () => void;
  onCampaignUpdated?: () => void;
}) {
  const navigate = useNavigate();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionResult, setActionResult] = useState<{ id: string; type: 'success' | 'error'; message: string } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!campaign) return null;

  const platformInfo = getPlatformLabel(campaign.platform);
  const metaUrl = getMetaAdsUrl(campaign.platformCampaignId);
  const recommendations = generateRecommendations(campaign);

  const handleApiAction = async (recId: string, apiParams: { status?: string; dailyBudget?: number }) => {
    if (!campaign.platformCampaignId) return;
    setActionLoading(recId);
    setActionResult(null);
    try {
      const api = (window as any).aiSuites?.campaigns;
      if (!api?.update) throw new Error('Update API not available');
      const result = await api.update(campaign.platformCampaignId, apiParams);
      if (!result.success) throw new Error(result.error || 'Failed');
      setActionResult({ id: recId, type: 'success', message: 'Done' });
      onCampaignUpdated?.();
    } catch (err: any) {
      setActionResult({ id: recId, type: 'error', message: err.message || 'Failed' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteCampaign = async () => {
    if (!campaign.platformCampaignId) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const api = (window as any).aiSuites?.campaigns;
      if (!api?.delete) throw new Error('Delete API not available');
      const result = await api.delete(campaign.platformCampaignId);
      if (!result.success) throw new Error(result.error || 'Failed to delete campaign');
      setShowDeleteConfirm(false);
      onCampaignUpdated?.();
      onClose();
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete campaign');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[420px] bg-white shadow-xl z-50 flex flex-col animate-[slideInRight_200ms_ease-out]">
        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-semibold text-gray-900">Campaign Details</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border-none bg-transparent"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Campaign name + status */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 leading-snug">{campaign.name}</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${getStatusPillStyle(campaign.status)}`}>
                {getStatusIcon(campaign.status)}
                {campaign.status}
              </span>
              {platformInfo && (
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${platformInfo.bg}`}>
                  {platformInfo.label}
                </span>
              )}
            </div>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-[10px] text-gray-400 mb-1">ROAS</div>
              <div className="text-xl font-semibold text-gray-900 font-mono">{campaign.roas.toFixed(1)}x</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-[10px] text-gray-400 mb-1">CPA</div>
              <div className="text-xl font-semibold text-gray-900 font-mono">${campaign.cpa.toFixed(0)}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-[10px] text-gray-400 mb-1">Revenue</div>
              <div className="text-xl font-semibold text-gray-900 font-mono">${(campaign.revenue / 1000).toFixed(1)}k</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-[10px] text-gray-400 mb-1">Spend</div>
              <div className="text-xl font-semibold text-gray-900 font-mono">${(campaign.spent || 0).toLocaleString()}</div>
            </div>
          </div>

          {/* Detailed metrics */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Performance Breakdown</h4>
            <div className="bg-gray-50 rounded-lg divide-y divide-gray-100">
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-xs text-gray-500">Impressions</span>
                <span className="text-xs font-semibold text-gray-900 font-mono">{(campaign.impressions || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-xs text-gray-500">Clicks</span>
                <span className="text-xs font-semibold text-gray-900 font-mono">{(campaign.clicks || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-xs text-gray-500">CTR</span>
                <span className="text-xs font-semibold text-gray-900 font-mono">{(campaign.ctr || 0).toFixed(2)}%</span>
              </div>
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-xs text-gray-500">Conversions</span>
                <span className="text-xs font-semibold text-gray-900 font-mono">{(campaign.conversions || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-xs text-gray-500">Budget</span>
                <span className="text-xs font-semibold text-gray-900 font-mono">${(campaign.budget || 0).toLocaleString()}</span>
              </div>
              {campaign.adGroupCount !== undefined && (
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-xs text-gray-500">Ad Groups</span>
                  <span className="text-xs font-semibold text-gray-900 font-mono">{campaign.adGroupCount}</span>
                </div>
              )}
              {campaign.startDate && campaign.startDate !== campaign.endDate && (
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-xs text-gray-500">Flight Dates</span>
                  <span className="text-xs font-semibold text-gray-900 font-mono">
                    {formatDate(campaign.startDate)} — {campaign.endDate ? formatDate(campaign.endDate) : 'Ongoing'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Recommendations</h4>
            </div>
            <div className="space-y-2">
              {recommendations.map((rec) => {
                const RecIcon = rec.icon;
                const severityStyles = {
                  critical: { border: 'border-l-red-400', iconColor: 'text-red-500', bg: 'bg-red-50' },
                  warning: { border: 'border-l-amber-400', iconColor: 'text-amber-500', bg: 'bg-amber-50' },
                  suggestion: { border: 'border-l-blue-400', iconColor: 'text-blue-500', bg: 'bg-blue-50' },
                  success: { border: 'border-l-emerald-400', iconColor: 'text-emerald-500', bg: 'bg-emerald-50' },
                }[rec.severity];
                const isLoading = actionLoading === rec.id;
                const result = actionResult?.id === rec.id ? actionResult : null;
                return (
                  <div
                    key={rec.id}
                    className={`bg-white rounded-lg p-3 border border-gray-100 border-l-[3px] ${severityStyles.border}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`w-6 h-6 rounded-md ${severityStyles.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                        <RecIcon className={`w-3.5 h-3.5 ${severityStyles.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-900">{rec.title}</div>
                        <p className="text-[11px] text-gray-500 leading-relaxed mt-1">{rec.description}</p>
                        {rec.action && (
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            {rec.action.type === 'link' ? (
                              <a
                                href={rec.action.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-800 transition-colors no-underline"
                              >
                                <ExternalLink className="w-3 h-3" />
                                {rec.action.label}
                              </a>
                            ) : rec.action.type === 'form' ? (
                              <button
                                onClick={() => {
                                  sessionStorage.setItem('adsetCampaignContext', JSON.stringify({
                                    campaignId: campaign.platformCampaignId,
                                    campaignName: campaign.name,
                                    campaignType: campaign.type,
                                    campaignStatus: campaign.status,
                                    budget: campaign.budget,
                                    platform: campaign.platform || 'meta',
                                    spent: campaign.spent,
                                    roas: campaign.roas,
                                    cpa: campaign.cpa,
                                  }));
                                  onClose();
                                  navigate(`/campaign-chat?adsetForCampaign=${campaign.platformCampaignId}`);
                                }}
                                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors border-none cursor-pointer"
                              >
                                <Sparkles className="w-3 h-3" />
                                {rec.action.label}
                              </button>
                            ) : (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => rec.action!.apiParams && handleApiAction(rec.id, rec.action!.apiParams)}
                                  disabled={isLoading}
                                  className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-transparent border-none cursor-pointer p-0"
                                >
                                  {isLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                                  {rec.action.label}
                                </button>
                                {result && (
                                  <span className={`text-[10px] font-medium ${result.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {result.message}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-gray-100 space-y-2">
          {metaUrl && (
            <a
              href={metaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors no-underline"
            >
              <ExternalLink className="w-4 h-4" />
              Open in Meta Ads Manager
            </a>
          )}
          {campaign.platformCampaignId && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-white hover:bg-red-50 text-red-600 text-sm font-medium rounded-lg transition-colors border border-red-200 hover:border-red-300 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Delete Campaign
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => !isDeleting && setShowDeleteConfirm(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-[360px] p-6 animate-[fadeIn_200ms_ease-out]">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Delete campaign?</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  This will permanently delete <strong>{campaign.name}</strong> from your Meta ad account. All ad groups and ads within this campaign will also be deleted. This cannot be undone.
                </p>
              </div>
            </div>

            {deleteError && (
              <div className="mb-4 px-3 py-2 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-xs text-red-700">{deleteError}</p>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={handleDeleteCampaign}
                disabled={isDeleting}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors border-none cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Campaign
                  </>
                )}
              </button>
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeleteError(null); }}
                disabled={isDeleting}
                className="px-4 py-2.5 text-xs font-medium text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded-lg transition-colors border-none cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function UnifiedViewDashboard() {
  const location = useLocation();

  const { campaigns, summary, isLoading, error, lastFetchedAt, fetchCampaigns } = useOptimizeStore();
  const { dashboardView, setDashboardView } = useSettingsStore();
  const { programs } = useProgramStore();
  const onboardingCompleted = useOnboardingStore((s) => s.completed);
  const onboardingProfile = useOnboardingStore((s) => s.profile);
  const resetOnboardingStore = useOnboardingStore((s) => s.resetOnboarding);
  const hasRealData = campaigns.length > 0 && campaigns.some((c) => (c.spent || 0) > 0 || (c.metrics?.conversions || 0) > 0);

  // Derive role-based personalization config
  const roleConfig = onboardingCompleted && onboardingProfile?.role
    ? rolePersonalizationConfig[onboardingProfile.role] ?? null
    : null;

  const [activeTab, setActiveTab] = useState<TabId>(() => roleConfig?.defaultTab ?? 'orchestration');
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignPerformance | null>(null);
  const [triggerOnboarding, setTriggerOnboarding] = useState(false);
  const [campaignTrendMetric, setCampaignTrendMetric] = useState<'spend' | 'conversions' | 'roas'>('spend');
  const [pinnedKpis, setPinnedKpis] = useState<Set<string>>(new Set(['revenue', 'conversions', 'cpa', 'roas', 'spend']));
  const [chartContext, setChartContext] = useState<string | null>(null);

  const handleChartAskAI = (chartId?: string) => {
    setChartContext(chartId ?? null);
    setIsChatOpen(true);
  };

  const [pinnedWidgets, setPinnedWidgets] = useState<Set<string>>(new Set([
    'budget-allocation-shifts', 'spend-by-channel', 'cpa-top-channels', 'channel-efficiency-table',
    'performance-trend', 'type-status-breakdown', 'top-performing', 'bottom-performing',
    'roas-comparison-spend-revenue', 'audience-performance-cards',
    'format-fatigue', 'top-creatives', 'bubble-chart', 'scale-pause',
  ]));

  const handlePersonalize = () => {
    if (onboardingCompleted) {
      resetOnboardingStore();
    }
    setTriggerOnboarding(false);
    // Use microtask to ensure the reset is processed before triggering
    setTimeout(() => {
      setIsChatOpen(true);
      setTriggerOnboarding(true);
    }, 0);
  };

  // When onboarding completes, switch to the role's default tab
  useEffect(() => {
    if (roleConfig?.defaultTab) {
      setActiveTab(roleConfig.defaultTab);
    }
  }, [roleConfig?.defaultTab]);

  // Fetch campaigns on mount if not fetched recently (5 min cache)
  useEffect(() => {
    const FIVE_MINUTES = 5 * 60 * 1000;
    if (!lastFetchedAt || Date.now() - lastFetchedAt > FIVE_MINUTES) {
      fetchCampaigns();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Pre-select campaign from location state
  useEffect(() => {
    const campaignId = (location.state as { campaignId?: string } | null)?.campaignId;
    if (campaignId && campaigns.length > 0) {
      const campaign = campaigns.find((c) => c.id === campaignId);
      if (campaign) {
        const campaignCard = mapToCampaignCard(campaign, 0);
        setSelectedCampaign(campaignCard);
        setActiveTab('campaigns');
      }
    }
  }, [location.state, campaigns]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRefresh = () => {
    fetchCampaigns().then(() => {
      setLastRefreshed(new Date());
    });
  };

  // Derive KPI data from real campaigns or fall back to mocks
  // Prioritize KPI cards based on onboarding key metrics
  const kpiData: KPICardProps[] = useMemo(() => {
    // CMO view: 4 executive-level KPI cards
    if (dashboardView === 'cmo') {
      return [
        { id: 'revenue', label: 'Total Revenue', value: '$2.4M', change: +18, icon: DollarSign, sparkline: [{ v: 1.8 }, { v: 1.9 }, { v: 2.0 }, { v: 2.1 }, { v: 2.1 }, { v: 2.2 }, { v: 2.2 }, { v: 2.3 }, { v: 2.3 }, { v: 2.4 }] },
        { id: 'roas', label: 'Overall ROAS', value: '4.2x', change: +12, icon: TrendingUp, sparkline: [{ v: 3.2 }, { v: 3.4 }, { v: 3.5 }, { v: 3.6 }, { v: 3.7 }, { v: 3.8 }, { v: 3.9 }, { v: 4.0 }, { v: 4.1 }, { v: 4.2 }] },
        { id: 'impressions', label: 'Active Campaigns', value: `${campaigns.length + 6}`, icon: BarChart3 },
        { id: 'budget-util', label: 'Budget Utilization', value: '73%', icon: Wallet, pacing: { spent: 73, budget: 100 } },
      ].filter((kpi) => pinnedKpis.has(kpi.id));
    }

    const baseData = (() => {
    if (!hasRealData) return mockKpiData;

    const totalSpend = campaigns.reduce((s, c) => s + (c.spent || 0), 0);
    const totalImpressions = campaigns.reduce((s, c) => s + (c.metrics?.impressions || 0), 0);
    const totalClicks = campaigns.reduce((s, c) => s + (c.metrics?.clicks || 0), 0);
    const totalConversions = campaigns.reduce((s, c) => s + (c.metrics?.conversions || 0), 0);
    const avgCpa = totalConversions > 0 ? totalSpend / totalConversions : 0;
    const weightedRoas = totalSpend > 0
      ? campaigns.reduce((s, c) => s + (c.metrics?.roas || 0) * (c.spent || 0), 0) / totalSpend
      : 0;
    const revenue = totalSpend * weightedRoas;

    return [
      { id: 'revenue', label: 'Revenue', value: `$${Math.round(revenue).toLocaleString()}`, icon: DollarSign },
      { id: 'conversions', label: 'Conversions', value: totalConversions.toLocaleString(), icon: ShoppingCart },
      { id: 'cpa', label: 'CPA', value: `$${avgCpa.toFixed(0)}`, icon: Target, invertColor: true },
      { id: 'roas', label: 'ROAS', value: `${weightedRoas.toFixed(1)}x`, icon: TrendingUp },
      { id: 'spend', label: 'Spend / Pacing', value: `$${Math.round(totalSpend).toLocaleString()}`, icon: Wallet, pacing: { spent: totalSpend, budget: summary.totalBudget || totalSpend } },
    ];
    })();

    // Reorder based on user's key metrics preference, falling back to role config
    const metricToLabel: Record<string, string> = {
      'ROAS': 'ROAS', 'CPA': 'CPA', 'CTR': 'CTR', 'Conversions': 'Conversions',
      'Impressions': 'Impressions', 'Budget pacing': 'Spend / Pacing',
    };

    let preferred: string[] = [];
    if (onboardingProfile?.keyMetrics?.length) {
      preferred = onboardingProfile.keyMetrics
        .map((m) => metricToLabel[m])
        .filter(Boolean);
    } else if (roleConfig?.kpiPriority?.length) {
      preferred = roleConfig.kpiPriority;
    }

    const ordered = preferred.length === 0 ? baseData : [
      ...baseData.filter((k) => preferred.includes(k.label)),
      ...baseData.filter((k) => !preferred.includes(k.label)),
    ];
    return ordered.filter((kpi) => !kpi.id || pinnedKpis.has(kpi.id));
  }, [dashboardView, hasRealData, campaigns, summary.totalBudget, onboardingProfile?.keyMetrics, roleConfig?.kpiPriority, pinnedKpis]);

  // Map a LiveCampaign to a CampaignPerformance card
  const mapToCampaignCard = (c: typeof campaigns[number], i: number): CampaignPerformance => ({
    rank: i + 1,
    name: c.name,
    status: mapCampaignStatus(c.status),
    type: 'Prospecting' as CampaignPerformance['type'],
    roas: c.metrics?.roas || 0,
    cpa: c.metrics?.cpa || 0,
    revenue: (c.spent || 0) * (c.metrics?.roas || 0),
    trend: 0,
    insights: [
      `ROAS: ${(c.metrics?.roas || 0).toFixed(1)}x with ${(c.metrics?.conversions || 0).toLocaleString()} conversions`,
      `CTR: ${(c.metrics?.ctr || 0).toFixed(2)}% · Spend: $${(c.spent || 0).toLocaleString()}`,
    ] as [string, string],
    platform: c.platform,
    platformCampaignId: c.platformCampaignId,
    id: c.id,
    spent: c.spent,
    impressions: c.metrics?.impressions,
    clicks: c.metrics?.clicks,
    conversions: c.metrics?.conversions,
    ctr: c.metrics?.ctr,
    budget: c.budget,
    startDate: c.startDate,
    endDate: c.endDate,
    adGroupCount: c.adGroups?.length,
  });

  // All real campaigns sorted by ROAS desc
  const allRealCampaigns = useMemo(() => {
    if (!hasRealData) return [];
    return [...campaigns]
      .sort((a, b) => (b.metrics?.roas || 0) - (a.metrics?.roas || 0))
      .map(mapToCampaignCard);
  }, [hasRealData, campaigns]);

  // For mock data fallback, keep separate top/bottom
  const topCampaigns = hasRealData ? allRealCampaigns : mockTopCampaigns;
  const bottomCampaigns = hasRealData ? [] : mockBottomCampaigns;

  // Derive budget allocation data
  const budgetAllocationData = useMemo(() => {
    if (!hasRealData) return mockBudgetAllocationData;
    const channelMap = new Map<string, { current: number; recommended: number }>();
    campaigns.forEach((c) => {
      const ch = c.channel || 'Other';
      const existing = channelMap.get(ch) || { current: 0, recommended: 0 };
      existing.current += c.spent || 0;
      existing.recommended += c.budget || 0;
      channelMap.set(ch, existing);
    });
    return Array.from(channelMap.entries()).map(([channel, data]) => ({
      channel,
      current: Math.round(data.current),
      recommended: Math.round(data.recommended),
    }));
  }, [hasRealData, campaigns]);

  // Derive channel performance data
  const channelPerformanceData = useMemo(() => {
    if (!hasRealData) return mockChannelPerformanceData;
    const channelMap = new Map<string, { spend: number; conversions: number }>();
    campaigns.forEach((c) => {
      const ch = c.channel || 'Other';
      const existing = channelMap.get(ch) || { spend: 0, conversions: 0 };
      existing.spend += c.spent || 0;
      existing.conversions += c.metrics?.conversions || 0;
      channelMap.set(ch, existing);
    });
    return Array.from(channelMap.entries())
      .map(([channel, data]) => ({
        channel,
        cpa: data.conversions > 0 ? data.spend / data.conversions : 0,
      }))
      .sort((a, b) => a.cpa - b.cpa);
  }, [hasRealData, campaigns]);

  // Derive top channels
  const topChannels = useMemo(() => {
    if (!hasRealData) return mockTopChannels;
    const channelMap = new Map<string, { spend: number; roas: number; clicks: number; impressions: number }>();
    campaigns.forEach((c) => {
      const ch = c.channel || 'Other';
      const existing = channelMap.get(ch) || { spend: 0, roas: 0, clicks: 0, impressions: 0 };
      existing.spend += c.spent || 0;
      existing.clicks += c.metrics?.clicks || 0;
      existing.impressions += c.metrics?.impressions || 0;
      channelMap.set(ch, existing);
    });
    // Compute weighted ROAS per channel
    campaigns.forEach((c) => {
      const ch = c.channel || 'Other';
      const existing = channelMap.get(ch)!;
      existing.roas += (c.metrics?.roas || 0) * (c.spent || 0);
      channelMap.set(ch, existing);
    });
    return Array.from(channelMap.entries())
      .map(([name, data]) => ({
        name,
        roas: `${(data.spend > 0 ? data.roas / data.spend : 0).toFixed(1)}x`,
        ctr: `${(data.impressions > 0 ? (data.clicks / data.impressions) * 100 : 0).toFixed(1)}%`,
      }))
      .sort((a, b) => parseFloat(b.roas) - parseFloat(a.roas))
      .slice(0, 3);
  }, [hasRealData, campaigns]);

  const channelPieData = useMemo(() =>
    channelSpendData.map(c => ({ name: c.channel, value: c.spend, color: c.color })),
    []
  );

  const totalCurrent = budgetData.reduce((s, d) => s + d.current, 0);
  const totalRecommended = budgetData.reduce((s, d) => s + d.recommended, 0);
  const delta = ((totalRecommended - totalCurrent) / totalCurrent) * 100;

  const isRefreshing = isLoading;

  const tabs = [
    { id: 'orchestration' as const, label: 'Cross Channel Orchestration' },
    { id: 'campaigns' as const, label: 'Campaigns' },
    { id: 'audience' as const, label: 'Audience' },
    { id: 'creative' as const, label: 'Creative' },
  ];

  // Helper: reorder sections by roleConfig priority
  function orderSections(
    sections: { id: string; render: () => React.ReactNode }[],
    tab: TabId,
  ) {
    if (!roleConfig) return sections;
    const order = roleConfig.sectionOrder[tab];
    if (!order) return sections;
    const ordered: typeof sections = [];
    for (const id of order) {
      const s = sections.find((sec) => sec.id === id);
      if (s) ordered.push(s);
    }
    // Append any sections not in the order config
    for (const s of sections) {
      if (!ordered.includes(s)) ordered.push(s);
    }
    return ordered;
  }

  // Insight callout banner for role-personalized views
  function renderInsightCallout(tab: TabId) {
    if (!roleConfig || !onboardingProfile?.role) return null;
    const text = roleConfig.insightCallouts[tab];
    if (!text) return null;
    return (
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 mb-2">
        <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-500">
            {onboardingProfile.role} Insight
          </span>
          <p className="text-xs text-blue-700 mt-0.5 leading-relaxed">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Slide-in Chat Panel */}
      <UnifiedChatPanel isOpen={isChatOpen} onClose={() => { setIsChatOpen(false); setTriggerOnboarding(false); setChartContext(null); }} startOnboarding={triggerOnboarding} pinnedKpis={pinnedKpis} setPinnedKpis={setPinnedKpis} pinnedWidgets={pinnedWidgets} setPinnedWidgets={setPinnedWidgets} chartContext={chartContext} onClearChartContext={() => setChartContext(null)} />

      {/* Main column — white rounded canvas */}
      <div className={`flex-1 flex flex-col overflow-y-auto bg-white border border-gray-100 relative ${isChatOpen ? 'rounded-r-2xl' : 'rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)]'}`}>
        {/* Chat toggle icon in top left corner (only show when chat is closed) */}
        {!isChatOpen && (
          <button
            onClick={() => setIsChatOpen(true)}
            className="absolute top-6 left-6 w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer"
            title="Open AI Assistant"
          >
            <MessageSquare className="w-3.5 h-3.5 text-gray-700" />
          </button>
        )}

        {/* Fixed header: daily briefing + KPI cards + tabs */}
        <div className="shrink-0 px-6 pt-6">
          <div className={`flex items-center gap-2 mb-2 ${isChatOpen ? '' : 'ml-13'}`}>
            <span className="text-[11px] text-gray-400">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
            <div className="ml-auto flex items-center gap-2">
              <div className="relative">
                <select
                  value={dashboardView}
                  onChange={(e) => setDashboardView(e.target.value as 'manager' | 'cmo')}
                  className="appearance-none bg-white border border-gray-200 hover:border-blue-300 rounded-lg pl-3 pr-8 py-1.5 text-xs font-medium text-gray-700 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                >
                  <option value="manager">Campaign Manager View</option>
                  <option value="cmo">CMO Dashboard View</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
              <Button
                variant="secondary"
                size="sm"
                icon={<Sparkles className="w-3 h-3" />}
                onClick={handlePersonalize}
                title="Personalize your experience"
                className="!text-xs !h-[28px] !py-1.5"
              >
                Personalize
              </Button>
            </div>
          </div>
          <div className={`flex items-center gap-3 ${isChatOpen ? '' : 'ml-13'}`}>
            <h1 className="text-2xl font-semibold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #4BC8FE 0%, #94D056 50%)' }}>
              {new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening'}{onboardingCompleted && onboardingProfile?.name ? `, ${onboardingProfile.name}` : ''}!
            </h1>
            <span className="text-[11px] text-gray-400 ml-auto">
              Updated {lastRefreshed.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </span>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh data"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          {onboardingCompleted && onboardingProfile && (
            <p className={`text-xs text-gray-400 mt-0.5 ${isChatOpen ? '' : 'ml-13'}`}>
              {onboardingProfile.role} · {onboardingProfile.industry}{onboardingProfile.goals.length > 0 ? ` · Focus: ${onboardingProfile.goals.slice(0, 2).join(', ')}` : ''}
            </p>
          )}
          {hasRealData ? (
            <p className={`text-sm text-gray-500 mt-1 max-w-md ${isChatOpen ? '' : 'ml-13'}`}>
              {dashboardView === 'cmo'
                ? <>Portfolio ROAS at {summary.overallRoas > 0 ? `${summary.overallRoas.toFixed(1)}x` : '4.2x'} across {summary.activeCampaigns} campaigns. Total spend ${Math.round(summary.totalSpent).toLocaleString()} with 73% budget utilization.</>
                : <>{summary.activeCampaigns} active campaign{summary.activeCampaigns !== 1 ? 's' : ''} across ${Math.round(summary.totalSpent).toLocaleString()} total spend.
                  {summary.overallRoas > 0 && ` Blended ROAS: ${summary.overallRoas.toFixed(1)}x.`}</>
              }
            </p>
          ) : (
            <p className={`text-sm text-gray-500 mt-1 max-w-md ${isChatOpen ? '' : 'ml-13'}`}>
              {onboardingCompleted && onboardingProfile ? (() => {
                if (dashboardView === 'cmo') return 'Revenue up 18% MoM to $2.4M. ROAS trending at 4.2x with TikTok as top performer. Budget 73% utilized — on track for quarterly targets.';
                // Role-specific briefing takes priority
                if (roleConfig?.dailyBriefing) return roleConfig.dailyBriefing;
                // Fall back to goals-based briefing
                const goals = onboardingProfile.goals || [];
                if (goals.includes('Budget optimization')) return 'Spend pacing aligned. Budget utilization at 68% with CPA trending down 5.1%.';
                if (goals.includes('Creative performance')) return 'Creative performance strong. Top carousel ads driving 3.8x ROAS. 2 creatives showing fatigue signals.';
                if (goals.includes('Audience targeting')) return 'Audience segments performing well. Lookalike audiences converting at 2.1x rate vs. interest-based targeting.';
                if (goals.includes('Cross-channel insights')) return 'Cross-channel performance on track. TikTok leading with 5.2x ROAS. Consider shifting budget from YouTube.';
                return 'Performance on track. Spend pacing aligned, CPA below target.';
              })() : (
                dashboardView === 'cmo'
                  ? <>Revenue up 18% MoM to $2.4M. ROAS trending at 4.2x with TikTok as top performer.<br />Budget 73% utilized — on track for quarterly targets.</>
                  : <>Performance on track. Spend pacing aligned, CPA below target.<br />Two campaigns need attention due to rising costs.</>
              )}
            </p>
          )}

          {/* KPI Cards */}
          <div className={`flex gap-4 mt-5 ${isChatOpen ? '' : 'ml-13'}`}>
            {kpiData.map((kpi) => (
              <KPICardComponent
                key={kpi.label}
                label={kpi.label}
                value={kpi.value}
                change={kpi.change}
                icon={kpi.icon}
                invertColor={kpi.invertColor}
                pacing={kpi.pacing}
                sparkline={kpi.sparkline}
              />
            ))}
          </div>

          {/* Personalized Focus Areas — only shown after onboarding */}
          {onboardingCompleted && onboardingProfile && onboardingProfile.goals.length > 0 && (
            <div className={`mt-4 ${isChatOpen ? '' : 'ml-13'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Your Focus Areas</span>
              </div>
              <div className="flex gap-3">
                {onboardingProfile.goals.map((goal) => {
                  const config: Record<string, { icon: string; metric: string; action: string; color: string }> = {
                    'Budget optimization': { icon: '💰', metric: '68% utilized · CPA -5.1%', action: 'Review budget shifts', color: 'border-emerald-200 bg-emerald-50/50' },
                    'Creative performance': { icon: '🎨', metric: '3.8x ROAS · 2 fatigued', action: 'Refresh creatives', color: 'border-amber-200 bg-amber-50/50' },
                    'Audience targeting': { icon: '🎯', metric: '2.1x lift · 3 segments', action: 'Expand audiences', color: 'border-purple-200 bg-purple-50/50' },
                    'Cross-channel insights': { icon: '🔗', metric: 'TikTok 5.2x · Meta 4.1x', action: 'View cross-channel', color: 'border-blue-200 bg-blue-50/50' },
                    'Reporting & analytics': { icon: '📊', metric: '3 reports ready', action: 'View reports', color: 'border-indigo-200 bg-indigo-50/50' },
                  };
                  const c = config[goal];
                  if (!c) return null;
                  return (
                    <button
                      key={goal}
                      onClick={() => {
                        const targetTab = goal === 'Creative performance' ? 'creative' as const
                          : goal === 'Audience targeting' ? 'audience' as const
                          : goal === 'Reporting & analytics' ? 'campaigns' as const
                          : 'orchestration' as const;
                        const sectionId = goal === 'Creative performance' ? 'section-creative'
                          : goal === 'Audience targeting' ? 'section-audience'
                          : goal === 'Reporting & analytics' ? 'section-campaigns'
                          : 'section-budget';
                        setActiveTab(targetTab);
                        // Scroll to section after React renders the new tab
                        requestAnimationFrame(() => {
                          setTimeout(() => {
                            document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }, 50);
                        });
                      }}
                      className={`flex-1 flex items-start gap-2.5 px-3 py-2.5 rounded-xl border ${c.color} transition-all hover:shadow-sm cursor-pointer`}
                    >
                      <span className="text-base mt-0.5">{c.icon}</span>
                      <div className="text-left min-w-0">
                        <div className="text-[11px] font-semibold text-gray-700 truncate">{goal}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{c.metric}</div>
                        <div className="text-[10px] font-medium text-blue-600 mt-1">{c.action} →</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {dashboardView === 'cmo' ? (
          <CMODashboardView isChatOpen={isChatOpen} onOpenChat={() => setIsChatOpen(true)} />
        ) : (<>
        {/* Sticky tab bar */}
        <div className="sticky top-0 z-10 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] py-3">
          <div className={`flex gap-1 px-6 ${isChatOpen ? '' : 'ml-13'}`}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer rounded-lg ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable tab content */}
        <div className={`pr-6 pb-6 pt-5 space-y-6 ${isChatOpen ? 'pl-6' : 'pl-19'}`}>

      {/* ── Cross Channel Orchestration Tab ── */}
      {activeTab === 'orchestration' && (() => {
        const sections = orderSections([
          { id: 'budget-allocation-shifts', render: () => (
            <div id="section-budget" className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
                <SectionHeader title="Budget Allocation" subtitle="AI-optimized budget distribution across channels" onAskAI={() => handleChartAskAI('budget-allocation-shifts')} />
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={budgetData} barGap={4} barCategoryGap="20%">
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="channel" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value: number | undefined) => [`$${(value ?? 0).toLocaleString()}`, '']} contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                      <Bar dataKey="current" name="Current Spend" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="recommended" name="Recommended" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Total Spend</p>
                    <p className="text-sm font-semibold text-gray-900">${(totalCurrent / 1000).toFixed(0)}k</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Efficient ROAS</p>
                    <p className="text-sm font-semibold text-emerald-600">${(totalRecommended / 1000).toFixed(0)}k</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Delta</p>
                    <p className="text-sm font-semibold text-emerald-600">+{delta.toFixed(0)}%</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
                <SectionHeader title="Recommended Budget Shifts" subtitle="AI-suggested reallocations to improve performance" onAskAI={() => handleChartAskAI('budget-allocation-shifts')} />
                <div className="space-y-3">
                  {budgetShifts.map((shift, i) => (
                    <div key={i} className="p-3 rounded-xl bg-gray-50/80 border border-gray-100">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-600 whitespace-nowrap">{shift.from}</span>
                          <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                          <span className="text-xs font-medium text-gray-900 whitespace-nowrap">{shift.to}</span>
                        </div>
                        <span className="text-sm font-bold text-emerald-600 whitespace-nowrap">+${shift.amount.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-gray-500">{shift.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )},
          { id: 'spend-by-channel', render: () => (
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
              <SectionHeader title="Spend by Channel" subtitle="Budget distribution across active channels" onAskAI={() => handleChartAskAI('spend-by-channel')} />
              <div className="flex items-start gap-6">
                <div className="flex-1">
                  <div className="space-y-2">
                    {channelSpendData.map(c => (
                      <div key={c.channel} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                          <span className="text-xs text-gray-600">{c.channel}</span>
                        </div>
                        <span className="text-xs font-semibold text-gray-900">${(c.spend / 1000).toFixed(1)}K</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Total</span>
                        <span className="text-xs font-bold text-gray-900">
                          ${(channelSpendData.reduce((s, d) => s + d.spend, 0) / 1000).toFixed(1)}K
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-[180px] w-[180px] flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={channelPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" stroke="none">
                        {channelPieData.map((entry, i) => (
                          <Cell key={entry.name} fill={channelSpendData[i].color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 11 }} formatter={(value: number | undefined) => [`$${((value ?? 0) / 1000).toFixed(1)}K`, '']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )},
          { id: 'cpa-top-channels', render: () => (
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <SectionHeader title="Channel Performance Metrics" subtitle="Cost per acquisition by channel" onAskAI={() => handleChartAskAI('cpa-top-channels')} />
                <div className="space-y-3">
                  {cpaByChannel.map((ch) => (
                    <div key={ch.channel} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-24 text-right flex-shrink-0">{ch.channel}</span>
                      <div className="flex-1 h-6 bg-gray-50 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(ch.cpa / 80) * 100}%`, backgroundColor: ch.color }} />
                      </div>
                      <span className="text-xs font-semibold text-gray-900 w-10 flex-shrink-0">${ch.cpa}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <SectionHeader title="Top Performing Channels" subtitle="Highest ROAS across active campaigns" onAskAI={() => handleChartAskAI('cpa-top-channels')} />
                <div className="space-y-3">
                  {mockTopChannels.map((ch, i) => (
                    <div key={ch.name} className="p-4 rounded-xl bg-gray-50/80 border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
                          <span className="text-sm font-semibold text-gray-900">{ch.name}</span>
                        </div>
                        <span className="text-xs text-emerald-500 font-medium flex items-center gap-0.5">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                          </svg>
                          Trending
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-3">
                        <div><p className="text-[10px] text-gray-400">ROAS</p><p className="text-sm font-bold text-gray-900">{ch.roas}x</p></div>
                        <div><p className="text-[10px] text-gray-400">CTR</p><p className="text-sm font-bold text-gray-900">{ch.ctr}%</p></div>
                        <div><p className="text-[10px] text-gray-400">Spend</p><p className="text-sm font-bold text-gray-900">{ch.spend}</p></div>
                        <div><p className="text-[10px] text-gray-400">Revenue</p><p className="text-sm font-bold text-gray-900">{ch.revenue}</p></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )},
          { id: 'channel-efficiency-table', render: () => (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <SectionHeader title="Channel Efficiency" subtitle="Comprehensive performance breakdown across all channels" onAskAI={() => handleChartAskAI('channel-efficiency-table')} />
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wide pb-3 pr-4">Channel</th>
                      <th className="text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wide pb-3 px-3">Spend</th>
                      <th className="text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wide pb-3 px-3">Revenue</th>
                      <th className="text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wide pb-3 px-3 w-32">ROAS</th>
                      <th className="text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wide pb-3 px-3">CPA</th>
                      <th className="text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wide pb-3 px-3">CTR</th>
                      <th className="text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wide pb-3 pl-3">Conv. Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {channelEfficiencyTableData.map((row) => (
                      <tr key={row.channel} className="border-b border-gray-50 last:border-0">
                        <td className="py-3 pr-4 font-medium text-gray-900 text-xs">{row.channel}</td>
                        <td className="py-3 px-3 text-right text-xs text-gray-600">{row.spend}</td>
                        <td className="py-3 px-3 text-right text-xs text-gray-600">{row.revenue}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${row.roasBar}%`, backgroundColor: row.roas >= 4 ? '#10b981' : row.roas >= 3 ? '#f59e0b' : '#ef4444' }} />
                            </div>
                            <span className="text-xs font-semibold text-gray-900 w-8">{row.roas}x</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right text-xs text-gray-600">${row.cpa}</td>
                        <td className="py-3 px-3 text-right text-xs text-gray-600">{row.ctr}%</td>
                        <td className="py-3 pl-3 text-right text-xs text-gray-600">{row.convRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )},
        ], 'orchestration');
        return (<>
          {renderInsightCallout('orchestration')}
          {sections.filter(s => pinnedWidgets.has(s.id)).map(s => <Fragment key={s.id}>{s.render()}</Fragment>)}
        </>);
      })()}

      {/* ── Campaigns Tab ── */}
      {activeTab === 'campaigns' && (() => {
        const sections = orderSections([
          { id: 'performance-trend', render: () => (
            <div id="section-campaigns" className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-0.5">Campaign Performance Trend</h4>
                  <p className="text-xs text-gray-400">Past 14 days</p>
                </div>
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                  {(['spend', 'conversions', 'roas'] as const).map(m => (
                    <button key={m} onClick={() => setCampaignTrendMetric(m)} className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all cursor-pointer border-none ${campaignTrendMetric === m ? 'bg-white text-gray-900 shadow-sm' : 'bg-transparent text-gray-500'}`}>
                      {m === 'spend' ? 'Spend' : m === 'conversions' ? 'Conv.' : 'ROAS'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={campaignPerformanceTrend} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="campaignTrendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={campaignTrendMetric === 'spend' ? '#3b82f6' : campaignTrendMetric === 'conversions' ? '#10b981' : '#8b5cf6'} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={campaignTrendMetric === 'spend' ? '#3b82f6' : campaignTrendMetric === 'conversions' ? '#10b981' : '#8b5cf6'} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => campaignTrendMetric === 'spend' ? `$${(v / 1000).toFixed(0)}k` : campaignTrendMetric === 'roas' ? `${v}x` : String(v)} />
                    <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 11, padding: '8px 12px' }} formatter={(value: number | undefined) => [campaignTrendMetric === 'spend' ? `$${(value ?? 0).toLocaleString()}` : campaignTrendMetric === 'roas' ? `${value}x` : String(value ?? 0), campaignTrendMetric === 'spend' ? 'Spend' : campaignTrendMetric === 'conversions' ? 'Conversions' : 'ROAS']} />
                    <Area type="monotone" dataKey={campaignTrendMetric} stroke={campaignTrendMetric === 'spend' ? '#3b82f6' : campaignTrendMetric === 'conversions' ? '#10b981' : '#8b5cf6'} strokeWidth={2} fill="url(#campaignTrendGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )},
          { id: 'type-status-breakdown', render: () => (
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Campaigns by Type</h4>
                <p className="text-xs text-gray-400 mb-4">Distribution across campaign objectives</p>
                <div className="flex items-center gap-6">
                  <div className="h-[160px] w-[160px] flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={campaignTypeBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value" stroke="none">
                          {campaignTypeBreakdown.map((entry) => (<Cell key={entry.name} fill={entry.color} />))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 11 }} formatter={(value: number | undefined) => [`${value ?? 0} campaigns`, '']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 flex-1">
                    {campaignTypeBreakdown.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="text-xs text-gray-600">{item.name}</span>
                        </div>
                        <span className="text-xs font-semibold text-gray-900">{item.value}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Total</span>
                        <span className="text-xs font-bold text-gray-900">{campaignTypeBreakdown.reduce((s, d) => s + d.value, 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Campaigns by Status</h4>
                <p className="text-xs text-gray-400 mb-4">Current operational state</p>
                <div className="flex items-center gap-6">
                  <div className="h-[160px] w-[160px] flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={campaignStatusBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value" stroke="none">
                          {campaignStatusBreakdown.map((entry) => (<Cell key={entry.name} fill={entry.color} />))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 11 }} formatter={(value: number | undefined) => [`${value ?? 0} campaigns`, '']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 flex-1">
                    {campaignStatusBreakdown.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="text-xs text-gray-600">{item.name}</span>
                        </div>
                        <span className="text-xs font-semibold text-gray-900">{item.value}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Total</span>
                        <span className="text-xs font-bold text-gray-900">{campaignStatusBreakdown.reduce((s, d) => s + d.value, 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )},
          { id: 'top-performing', render: () => (
            <div className="bg-gray-50/60 rounded-xl p-5 border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-4 h-4 text-amber-500" />
                <h2 className="text-base font-semibold text-gray-900">{hasRealData ? 'All Campaigns' : 'Top Performing Campaigns'}</h2>
              </div>
              <p className="text-xs text-gray-500 mb-5">{hasRealData ? `${topCampaigns.length} campaign${topCampaigns.length !== 1 ? 's' : ''} from Meta Ads sorted by ROAS` : 'Highest efficiency campaigns driving the best ROAS and conversion volume'}</p>
              <div className={`grid gap-4 ${topCampaigns.length <= 3 ? 'grid-cols-3' : 'grid-cols-2 lg:grid-cols-3'}`}>
                {topCampaigns.map((c) => {
                  const platformInfo = getPlatformLabel(c.platform);
                  return (
                    <div key={c.rank} className="bg-white rounded-2xl border border-gray-100 p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">#{c.rank}</span>
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${getStatusPillStyle(c.status)}`}>{getStatusIcon(c.status)}{c.status}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {platformInfo && (<span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${platformInfo.bg}`}>{platformInfo.label}</span>)}
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{c.type}</span>
                        </div>
                      </div>
                      <h5 className="text-sm font-semibold text-gray-900 mb-3 leading-snug">{c.name}</h5>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
                        <div><p className="text-[10px] text-gray-400">ROAS</p><p className="text-sm font-bold text-gray-900">{c.roas.toFixed(1)}x</p></div>
                        <div><p className="text-[10px] text-gray-400">CPA</p><p className="text-sm font-bold text-gray-900">${c.cpa}</p></div>
                        <div><p className="text-[10px] text-gray-400">Revenue</p><p className="text-sm font-bold text-gray-900">${(c.revenue / 1000).toFixed(1)}k</p></div>
                        <div><p className="text-[10px] text-gray-400">Trend</p><p className="text-sm font-bold text-emerald-500 flex items-center gap-0.5"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>{c.trend}%</p></div>
                      </div>
                      <div className="border-t border-gray-100 pt-3 space-y-1.5">
                        <div className="flex items-start gap-1.5"><span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" /><p className="text-[11px] text-gray-500 leading-relaxed">{c.insights[0]}</p></div>
                        <div className="flex items-start gap-1.5"><span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" /><p className="text-[11px] text-gray-500 leading-relaxed">{c.insights[1]}</p></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )},
          { id: 'bottom-performing', render: () => (
            bottomCampaigns.length > 0 ? (
              <div className="bg-gray-50/60 rounded-xl p-5 border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <h2 className="text-base font-semibold text-gray-900">Bottom Performing Campaigns</h2>
                </div>
                <p className="text-xs text-gray-500 mb-5">Bottom 3 of 24 active campaigns — candidates for pausing or budget reallocation</p>
                <div className="grid grid-cols-3 gap-4">
                  {bottomCampaigns.map((c) => {
                    const platformInfo = getPlatformLabel(c.platform);
                    return (
                      <div key={c.rank + c.name} className="bg-white rounded-2xl border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-xs font-bold">#{c.rank}</span>
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${getStatusPillStyle(c.status)}`}>{getStatusIcon(c.status)}{c.status}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {platformInfo && (<span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${platformInfo.bg}`}>{platformInfo.label}</span>)}
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{c.type}</span>
                          </div>
                        </div>
                        <h5 className="text-sm font-semibold text-gray-900 mb-3 leading-snug">{c.name}</h5>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
                          <div><p className="text-[10px] text-gray-400">ROAS</p><p className="text-sm font-bold text-gray-900">{c.roas.toFixed(1)}x</p></div>
                          <div><p className="text-[10px] text-gray-400">CPA</p><p className="text-sm font-bold text-gray-900">${c.cpa}</p></div>
                          <div><p className="text-[10px] text-gray-400">Revenue</p><p className="text-sm font-bold text-gray-900">${(c.revenue / 1000).toFixed(1)}k</p></div>
                          <div><p className="text-[10px] text-gray-400">Trend</p><p className="text-sm font-bold text-red-500 flex items-center gap-0.5"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>{c.trend}%</p></div>
                        </div>
                        <div className="border-t border-gray-100 pt-3 space-y-1.5">
                          <div className="flex items-start gap-1.5"><span className="w-1 h-1 rounded-full bg-red-400 mt-1.5 flex-shrink-0" /><p className="text-[11px] text-gray-500 leading-relaxed">{c.insights[0]}</p></div>
                          <div className="flex items-start gap-1.5"><span className="w-1 h-1 rounded-full bg-red-400 mt-1.5 flex-shrink-0" /><p className="text-[11px] text-gray-500 leading-relaxed">{c.insights[1]}</p></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null
          )},
        ], 'campaigns');
        return (<>
          {renderInsightCallout('campaigns')}
          {sections.filter(s => pinnedWidgets.has(s.id)).map(s => <Fragment key={s.id}>{s.render()}</Fragment>)}
        </>);
      })()}

      {/* ── Audience Tab ── */}
      {activeTab === 'audience' && (() => {
        const sections = orderSections([
          { id: 'roas-comparison-spend-revenue', render: () => (
            <div id="section-audience" className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <SectionHeader title="Audience ROAS Comparison" subtitle="Return on ad spend by segment" onAskAI={() => handleChartAskAI('roas-comparison-spend-revenue')} />
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={audienceSpendRevenueData} layout="vertical" barSize={16}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                      <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}x`} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={100} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }} formatter={(value: number | undefined) => [`${value ?? 0}x`, 'ROAS']} />
                      <Bar dataKey="roas" radius={[0, 4, 4, 0]}>
                        {audienceSpendRevenueData.map((entry) => (
                          <Cell key={entry.name} fill={entry.roas >= 4 ? '#10b981' : entry.roas >= 2.5 ? '#f59e0b' : '#ef4444'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <SectionHeader title="Spend vs. Revenue by Audience" subtitle="Investment efficiency across segments" onAskAI={() => handleChartAskAI('roas-comparison-spend-revenue')} />
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={audienceSpendRevenueData} barGap={4} barCategoryGap="25%">
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#9ca3af' }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" height={50} />
                      <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }} formatter={(value: number | undefined) => [`$${(value ?? 0).toLocaleString()}`, '']} />
                      <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                      <Bar dataKey="spend" name="Spend" fill="#ef4444" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
                      <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )},
          { id: 'audience-performance-cards', render: () => (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-blue-500" />
                <h2 className="text-base font-semibold text-gray-900">Audience Performance Analysis</h2>
              </div>
              <p className="text-xs text-gray-500 mb-5">Segment-level performance across all active campaigns and channels</p>
              <div className="grid grid-cols-4 gap-4">
                {audienceSegments.map((seg) => {
                  const roasLevel = seg.roas >= 4.0 ? 'high' : seg.roas >= 2.5 ? 'medium' : 'low';
                  const trendPositive = seg.trend > 0;
                  return (
                    <div key={seg.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-sm font-semibold text-gray-900 leading-snug">{seg.demo}</h5>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${roasLevel === 'high' ? 'bg-emerald-50 text-emerald-600' : roasLevel === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-500'}`}>{seg.roas.toFixed(1)}x ROAS</span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
                        <div><p className="text-[10px] text-gray-400">Spend</p><p className="text-sm font-bold text-gray-900">${(seg.spend / 1000).toFixed(1)}k</p></div>
                        <div><p className="text-[10px] text-gray-400">Revenue</p><p className="text-sm font-bold text-gray-900">${(seg.revenue / 1000).toFixed(1)}k</p></div>
                        <div><p className="text-[10px] text-gray-400">Conversions</p><p className="text-sm font-bold text-gray-900">{seg.conversions.toLocaleString()}</p></div>
                        <div><p className="text-[10px] text-gray-400">Trend</p><p className={`text-sm font-bold flex items-center gap-0.5 ${trendPositive ? 'text-emerald-500' : 'text-red-500'}`}><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={trendPositive ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} /></svg>{trendPositive ? '+' : ''}{seg.trend}%</p></div>
                      </div>
                      <div className="border-t border-gray-100 pt-3">
                        <p className="text-[10px] text-gray-400 mb-1">Top Channel: <span className="font-semibold text-gray-700">{seg.topChannel}</span> <span className="text-gray-300">({seg.campaignCount} campaigns)</span></p>
                        <p className="text-[11px] text-gray-500 leading-relaxed">{seg.insight}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )},
        ], 'audience');
        return (<>
          {renderInsightCallout('audience')}
          {sections.filter(s => pinnedWidgets.has(s.id)).map(s => <Fragment key={s.id}>{s.render()}</Fragment>)}
        </>);
      })()}

      {/* ── Creative Tab ── */}
      {activeTab === 'creative' && (() => {
        const sections = orderSections([
          { id: 'format-fatigue', render: () => (
            <div id="section-creative" className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <SectionHeader title="Performance by Format" subtitle="Average ROAS and CTR by creative type" onAskAI={() => handleChartAskAI('format-fatigue')} />
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={creativeFormatPerformance} barGap={4} barCategoryGap="30%">
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="format" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}x`} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                      <Bar yAxisId="left" dataKey="avgRoas" name="Avg ROAS" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="right" dataKey="avgCtr" name="Avg CTR %" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                  {creativeFormatPerformance.map((f) => (
                    <div key={f.format} className="text-center">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">{f.format}</p>
                      <p className="text-sm font-bold text-gray-900">{f.count} creatives</p>
                      <p className="text-[10px] text-gray-400">${(f.spend / 1000).toFixed(1)}k spend</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <SectionHeader title="Creative Fatigue Tracker" subtitle="Lifecycle health across all active creatives" onAskAI={() => handleChartAskAI('format-fatigue')} />
                <div className="space-y-2.5">
                  {[...creativeFatigueTimeline].sort((a, b) => b.fatigue - a.fatigue).map((c) => (
                    <div key={c.name} className="flex items-center gap-3">
                      <span className="text-[11px] text-gray-600 w-[120px] truncate flex-shrink-0" title={c.name}>{c.name}</span>
                      <div className="flex-1 h-5 bg-gray-50 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${c.fatigue}%`, backgroundColor: c.status === 'danger' ? '#ef4444' : c.status === 'warning' ? '#f59e0b' : '#10b981' }} />
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className={`text-[10px] font-semibold ${c.status === 'danger' ? 'text-red-500' : c.status === 'warning' ? 'text-amber-500' : 'text-emerald-500'}`}>{c.fatigue}%</span>
                        <span className="text-[10px] text-gray-400">{c.daysActive}d</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[10px] text-gray-400">Fresh (&lt;50%)</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /><span className="text-[10px] text-gray-400">Warning (50-69%)</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /><span className="text-[10px] text-gray-400">Fatigued (70%+)</span></div>
                </div>
              </div>
            </div>
          )},
          { id: 'top-creatives', render: () => (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
              <SectionHeader title="Top Performing Creatives" subtitle="Ranked by ROAS" onAskAI={() => handleChartAskAI('top-creatives')} />
              <div className="grid grid-cols-4 gap-3">
                {topCreatives.map((cr, i) => (
                  <div key={cr.name} className="bg-gray-50 rounded-xl px-4 py-3.5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[9px] font-bold text-gray-500">{i + 1}</span>
                      <span className="text-[10px] font-medium text-gray-400">{cr.type} · {cr.channel}</span>
                    </div>
                    <p className="text-xs font-semibold text-gray-900 mb-2 truncate" title={cr.name}>{cr.name}</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div><div className="text-[9px] text-gray-400">Impr.</div><div className="text-[10px] font-semibold text-gray-900">{cr.impressions}</div></div>
                      <div><div className="text-[9px] text-gray-400">CTR</div><div className="text-[10px] font-semibold text-gray-900">{cr.ctr}</div></div>
                      <div><div className="text-[9px] text-gray-400">ROAS</div><div className="text-[10px] font-semibold text-emerald-600">{cr.roas}x</div></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )},
          { id: 'bubble-chart', render: () => (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
              <SectionHeader title="Creative Performance: Volume vs. ROAS" subtitle="Bubble size represents spend allocation" onAskAI={() => handleChartAskAI('bubble-chart')} />
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 30, bottom: 10, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="impressions" type="number" name="Impressions" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} label={{ value: 'Impressions (Volume)', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#9ca3af' }} />
                    <YAxis dataKey="roas" type="number" name="ROAS" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}x`} label={{ value: 'ROAS', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#9ca3af' }} />
                    <ZAxis dataKey="spend" range={[200, 1200]} name="Spend" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-lg px-4 py-3 text-xs">
                          <p className="font-semibold text-gray-900 mb-1">{d.name}</p>
                          <p className="text-gray-500">Channel: <span className="text-gray-700">{d.channel}</span></p>
                          <p className="text-gray-500">Impressions: <span className="text-gray-700">{(d.impressions / 1000).toFixed(0)}k</span></p>
                          <p className="text-gray-500">ROAS: <span className="text-gray-700">{d.roas}x</span></p>
                          <p className="text-gray-500">Spend: <span className="text-gray-700">${d.spend.toLocaleString()}</span></p>
                        </div>
                      );
                    }} />
                    <Scatter data={creativeBubbles.filter(d => d.roas >= 3.5)} fill="#10b981" fillOpacity={0.7} name="High ROAS" />
                    <Scatter data={creativeBubbles.filter(d => d.roas >= 2 && d.roas < 3.5)} fill="#f59e0b" fillOpacity={0.7} name="Medium ROAS" />
                    <Scatter data={creativeBubbles.filter(d => d.roas < 2)} fill="#ef4444" fillOpacity={0.7} name="Low ROAS" />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          )},
          { id: 'scale-pause', render: () => (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>
                  </span>
                  <h4 className="text-sm font-semibold text-gray-900">Scale Winners</h4>
                </div>
                <div className="space-y-4">
                  {scaleWinners.map((c) => (
                    <div key={c.name} className="bg-white rounded-2xl border border-gray-100 p-5">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-sm font-semibold text-gray-900">{c.name}</h5>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">{c.roas}x ROAS</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{c.channel}</span>
                        <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{c.format}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-3 mb-3">
                        <div><p className="text-[10px] text-gray-400">ROAS</p><p className="text-sm font-bold text-gray-900">{c.roas}x</p></div>
                        <div><p className="text-[10px] text-gray-400">CTR</p><p className="text-sm font-bold text-gray-900">{c.ctr}%</p></div>
                        <div><p className="text-[10px] text-gray-400">Spend</p><p className="text-sm font-bold text-gray-900">{c.spend}</p></div>
                        <div><p className="text-[10px] text-gray-400">Conversions</p><p className="text-sm font-bold text-gray-900">{c.conversions}</p></div>
                      </div>
                      <div className="border-t border-gray-100 pt-3">
                        <div className="flex items-start gap-1.5"><span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" /><p className="text-[11px] text-gray-500 leading-relaxed">{c.insight}</p></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                  </span>
                  <h4 className="text-sm font-semibold text-gray-900">Pause / Refresh</h4>
                </div>
                <div className="space-y-4">
                  {pauseRefresh.map((c) => (
                    <div key={c.name} className="bg-white rounded-2xl border border-gray-100 p-5">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-sm font-semibold text-gray-900">{c.name}</h5>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-500">{c.roas}x ROAS</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{c.channel}</span>
                        <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{c.format}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-3 mb-3">
                        <div><p className="text-[10px] text-gray-400">ROAS</p><p className="text-sm font-bold text-gray-900">{c.roas}x</p></div>
                        <div><p className="text-[10px] text-gray-400">CTR</p><p className="text-sm font-bold text-gray-900">{c.ctr}%</p></div>
                        <div><p className="text-[10px] text-gray-400">Spend</p><p className="text-sm font-bold text-gray-900">{c.spend}</p></div>
                        <div><p className="text-[10px] text-gray-400">Conversions</p><p className="text-sm font-bold text-gray-900">{c.conversions}</p></div>
                      </div>
                      <div className="border-t border-gray-100 pt-3">
                        <div className="flex items-start gap-1.5">
                          <svg className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                          <p className="text-[11px] text-gray-500 leading-relaxed">{c.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )},
        ], 'creative');
        return (<>
          {renderInsightCallout('creative')}
          {sections.filter(s => pinnedWidgets.has(s.id)).map(s => <Fragment key={s.id}>{s.render()}</Fragment>)}
        </>);
      })()}

      </div>
      </>)}
      </div>

      {/* Campaign Detail Drawer */}
      {selectedCampaign && (
        <CampaignDetailDrawer
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
          onCampaignUpdated={() => {
            fetchCampaigns();
            setSelectedCampaign(null);
          }}
        />
      )}
    </div>
  );
}

