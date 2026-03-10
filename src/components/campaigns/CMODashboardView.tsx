/**
 * CMODashboardView — Executive dashboard for CMOs
 * Tabbed layout matching the Campaign Manager view style.
 * Shows strategic KPIs, channel strategy, portfolio health, and AI insights.
 */

import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line,
} from 'recharts';
import {
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  Lightbulb, AlertTriangle, CheckCircle, Target, Zap, Sparkles,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

type CmoTab = 'summary' | 'channels' | 'portfolio' | 'insights';

// ─── Mock Data ──────────────────────────────────────────────────────────────

const revenueOverTime = [
  { month: 'Sep', revenue: 1620000, spend: 420000 },
  { month: 'Oct', revenue: 1780000, spend: 440000 },
  { month: 'Nov', revenue: 1950000, spend: 460000 },
  { month: 'Dec', revenue: 2100000, spend: 510000 },
  { month: 'Jan', revenue: 2050000, spend: 480000 },
  { month: 'Feb', revenue: 2240000, spend: 500000 },
  { month: 'Mar', revenue: 2400000, spend: 520000 },
];

const roasTrend = [
  { month: 'Sep', roas: 3.86 },
  { month: 'Oct', roas: 4.05 },
  { month: 'Nov', roas: 4.24 },
  { month: 'Dec', roas: 4.12 },
  { month: 'Jan', roas: 4.27 },
  { month: 'Feb', roas: 4.48 },
  { month: 'Mar', roas: 4.20 },
];

const budgetVsActual = [
  { month: 'Sep', budget: 450000, actual: 420000 },
  { month: 'Oct', budget: 450000, actual: 440000 },
  { month: 'Nov', budget: 470000, actual: 460000 },
  { month: 'Dec', budget: 500000, actual: 510000 },
  { month: 'Jan', budget: 500000, actual: 480000 },
  { month: 'Feb', budget: 520000, actual: 500000 },
  { month: 'Mar', budget: 540000, actual: 520000 },
];

const channelMix = [
  { name: 'Meta', value: 35, color: '#3b82f6' },
  { name: 'Google Search', value: 22, color: '#ef4444' },
  { name: 'TikTok', value: 18, color: '#ec4899' },
  { name: 'YouTube', value: 12, color: '#f43f5e' },
  { name: 'Google Shopping', value: 8, color: '#f97316' },
  { name: 'LinkedIn', value: 5, color: '#0077b5' },
];

const channelROAS = [
  { channel: 'TikTok', roas: 5.2, prevRoas: 4.1, spend: 93600, revenue: 486720 },
  { channel: 'Meta', roas: 4.1, prevRoas: 3.8, spend: 182000, revenue: 746200 },
  { channel: 'Google Shopping', roas: 3.9, prevRoas: 3.5, spend: 41600, revenue: 162240 },
  { channel: 'Google Search', roas: 3.0, prevRoas: 3.2, spend: 114400, revenue: 343200 },
  { channel: 'YouTube', roas: 2.2, prevRoas: 2.0, spend: 62400, revenue: 137280 },
  { channel: 'LinkedIn', roas: 1.7, prevRoas: 1.5, spend: 26000, revenue: 44200 },
];

const channelTrends = [
  { month: 'Sep', meta: 3.4, tiktok: 3.8, google: 2.8, youtube: 1.9 },
  { month: 'Oct', meta: 3.6, tiktok: 4.0, google: 2.9, youtube: 2.0 },
  { month: 'Nov', meta: 3.7, tiktok: 4.3, google: 3.0, youtube: 2.0 },
  { month: 'Dec', meta: 3.8, tiktok: 4.6, google: 2.9, youtube: 2.1 },
  { month: 'Jan', meta: 3.9, tiktok: 4.8, google: 3.1, youtube: 2.1 },
  { month: 'Feb', meta: 4.0, tiktok: 5.0, google: 3.0, youtube: 2.2 },
  { month: 'Mar', meta: 4.1, tiktok: 5.2, google: 3.0, youtube: 2.2 },
];

const portfolioCampaigns = [
  { name: 'Summer Sale - Lookalikes', program: 'Q1 Revenue', channel: 'Meta', status: 'Scaling', roas: 6.8, spend: 48200, revenue: 327760, trend: +32, health: 'excellent' as const },
  { name: 'Healthcare Awareness Q1', program: 'Brand Awareness', channel: 'TikTok', status: 'Stable', roas: 5.2, spend: 36800, revenue: 191360, trend: +18, health: 'good' as const },
  { name: 'Spring Collection Retarget', program: 'Q1 Revenue', channel: 'Google', status: 'Active', roas: 4.5, spend: 28000, revenue: 126000, trend: +12, health: 'good' as const },
  { name: 'B2B Lead Gen - Decision Makers', program: 'Pipeline', channel: 'LinkedIn', status: 'Active', roas: 3.8, spend: 22000, revenue: 83600, trend: +5, health: 'fair' as const },
  { name: 'Brand Video Awareness', program: 'Brand Awareness', channel: 'YouTube', status: 'Monitoring', roas: 2.1, spend: 15000, revenue: 31500, trend: -8, health: 'at-risk' as const },
  { name: 'Product Launch Display', program: 'New Product', channel: 'Google', status: 'Underperforming', roas: 1.4, spend: 12000, revenue: 16800, trend: -15, health: 'poor' as const },
];

const programSummary = [
  { name: 'Q1 Revenue', campaigns: 4, spend: 156000, revenue: 624000, roas: 4.0, pacing: 72 },
  { name: 'Brand Awareness', campaigns: 3, spend: 82000, revenue: 221400, roas: 2.7, pacing: 65 },
  { name: 'Pipeline', campaigns: 2, spend: 48000, revenue: 182400, roas: 3.8, pacing: 80 },
  { name: 'New Product', campaigns: 2, spend: 34000, revenue: 47600, roas: 1.4, pacing: 55 },
];

const strategicInsights = [
  { type: 'opportunity' as const, title: 'Shift $6K from YouTube to TikTok', description: 'TikTok ROAS is 2.4x higher than YouTube. Reallocating budget could generate an additional $14K in revenue this month.', impact: '+$14K revenue', confidence: 92 },
  { type: 'opportunity' as const, title: 'Expand Meta Lookalike Audiences', description: 'Lookalike campaigns are outperforming interest-based by 2.1x. Scaling spend by 15% is projected to maintain efficiency.', impact: '+$22K revenue', confidence: 87 },
  { type: 'warning' as const, title: 'Creative Fatigue on "Spring Collection"', description: 'CTR has dropped 18% over 14 days. Refreshing top 3 creatives could recover $8K in weekly revenue.', impact: '-$8K/week risk', confidence: 85 },
  { type: 'warning' as const, title: 'LinkedIn CPA Rising Above Target', description: 'CPA increased 12% over the last 2 weeks. Consider narrowing audience targeting or pausing low-performers.', impact: '$3K over-spend risk', confidence: 78 },
  { type: 'success' as const, title: 'Google Shopping ROAS Up 11%', description: 'Feed optimization changes from last week are driving improved quality scores and lower CPCs.', impact: '+$5K revenue', confidence: 94 },
];

const forecastData = [
  { month: 'Mar', actual: 2400000, forecast: null as number | null },
  { month: 'Apr', actual: null as number | null, forecast: 2580000 },
  { month: 'May', actual: null, forecast: 2720000 },
  { month: 'Jun', actual: null, forecast: 2890000 },
];

const revenueForecastFull = [
  { month: 'Sep', actual: 1620000, forecast: null as number | null },
  { month: 'Oct', actual: 1780000, forecast: null },
  { month: 'Nov', actual: 1950000, forecast: null },
  { month: 'Dec', actual: 2100000, forecast: null },
  { month: 'Jan', actual: 2050000, forecast: null },
  { month: 'Feb', actual: 2240000, forecast: null },
  { month: 'Mar', actual: 2400000, forecast: 2400000 },
  { month: 'Apr', actual: null, forecast: 2580000 },
  { month: 'May', actual: null, forecast: 2720000 },
  { month: 'Jun', actual: null, forecast: 2890000 },
];

// ─── Tabs ───────────────────────────────────────────────────────────────────

const cmoTabs: { id: CmoTab; label: string }[] = [
  { id: 'summary', label: 'Executive Summary' },
  { id: 'channels', label: 'Channel Strategy' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'insights', label: 'Insights & Forecasts' },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

const fmtCurrency = (v: number) => {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
};

const healthColors: Record<string, string> = {
  excellent: 'bg-emerald-100 text-emerald-700',
  good: 'bg-blue-100 text-blue-700',
  fair: 'bg-amber-100 text-amber-700',
  'at-risk': 'bg-orange-100 text-orange-700',
  poor: 'bg-red-100 text-red-700',
};

// ─── Section Header ─────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle, onAskAI }: { title: string; subtitle?: string; onAskAI?: () => void }) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {onAskAI && (
          <button
            onClick={onAskAI}
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

// ─── Component ──────────────────────────────────────────────────────────────

interface CMODashboardViewProps {
  isChatOpen?: boolean;
  onOpenChat?: () => void;
}

export default function CMODashboardView({ isChatOpen = false, onOpenChat }: CMODashboardViewProps) {
  const [activeTab, setActiveTab] = useState<CmoTab>('summary');

  return (
    <>
      {/* Sticky tab bar */}
      <div className="sticky top-0 z-10 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] py-3">
        <div className={`flex gap-1 px-6 ${isChatOpen ? '' : 'ml-13'}`}>
          {cmoTabs.map((tab) => (
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

      {/* Tab content */}
      <div className={`pr-6 pb-6 pt-5 space-y-6 ${isChatOpen ? 'pl-6' : 'pl-19'}`}>

        {/* ── Executive Summary ── */}
        {activeTab === 'summary' && (
          <>
            {/* Revenue & Spend Trend */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
                <SectionHeader title="Revenue vs. Spend" subtitle="Monthly revenue and ad spend trend (last 7 months)" onAskAI={onOpenChat} />
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueOverTime}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => fmtCurrency(v)} />
                      <Tooltip formatter={(value: number | undefined) => [fmtCurrency(value ?? 0), '']} contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                      <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={2} fill="url(#revGrad)" />
                      <Area type="monotone" dataKey="spend" name="Ad Spend" stroke="#3b82f6" strokeWidth={2} fill="url(#spendGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* ROAS Trend */}
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
                <SectionHeader title="ROAS Trend" subtitle="Blended return on ad spend over time" onAskAI={onOpenChat} />
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={roasTrend}>
                      <defs>
                        <linearGradient id="roasGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[3, 5]} tickFormatter={(v) => `${v.toFixed(1)}x`} />
                      <Tooltip formatter={(value: number | undefined) => [`${(value ?? 0).toFixed(2)}x`, 'ROAS']} contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }} />
                      <Area type="monotone" dataKey="roas" name="ROAS" stroke="#8b5cf6" strokeWidth={2} fill="url(#roasGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Budget vs Actual */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
              <SectionHeader title="Budget vs. Actual Spend" subtitle="Monthly budget allocation compared to actual expenditure" onAskAI={onOpenChat} />
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={budgetVsActual} barGap={4} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => fmtCurrency(v)} />
                    <Tooltip formatter={(value: number | undefined) => [fmtCurrency(value ?? 0), '']} contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                    <Bar dataKey="budget" name="Budget" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="actual" name="Actual" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* ── Channel Strategy ── */}
        {activeTab === 'channels' && (
          <>
            <div className="grid grid-cols-2 gap-6">
              {/* Channel Mix Pie */}
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
                <SectionHeader title="Channel Mix" subtitle="Percentage of total spend by channel" onAskAI={onOpenChat} />
                <div className="flex items-center gap-6">
                  <div className="h-[200px] w-[200px] flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={channelMix} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value" stroke="none">
                          {channelMix.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 11 }} formatter={(value: number | undefined) => [`${value ?? 0}%`, '']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-2">
                    {channelMix.map((ch) => (
                      <div key={ch.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ch.color }} />
                          <span className="text-xs text-gray-600">{ch.name}</span>
                        </div>
                        <span className="text-xs font-semibold text-gray-900">{ch.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Channel ROAS Comparison */}
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
                <SectionHeader title="Channel ROAS" subtitle="Current vs previous period return on ad spend" onAskAI={onOpenChat} />
                <div className="space-y-3">
                  {channelROAS.map((ch) => {
                    const delta = ch.roas - ch.prevRoas;
                    const isUp = delta >= 0;
                    return (
                      <div key={ch.channel} className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-28 text-right flex-shrink-0">{ch.channel}</span>
                        <div className="flex-1 h-6 bg-gray-50 rounded-full overflow-hidden relative">
                          <div className="absolute inset-y-0 left-0 rounded-full bg-gray-200" style={{ width: `${(ch.prevRoas / 6) * 100}%` }} />
                          <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${(ch.roas / 6) * 100}%`, backgroundColor: isUp ? '#10b981' : '#ef4444' }} />
                        </div>
                        <span className="text-xs font-semibold text-gray-900 w-10 flex-shrink-0">{ch.roas}x</span>
                        <span className={`text-[10px] font-medium w-12 flex-shrink-0 ${isUp ? 'text-emerald-600' : 'text-red-500'}`}>
                          {isUp ? '+' : ''}{delta.toFixed(1)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Channel ROAS Trend Lines */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
              <SectionHeader title="Channel ROAS Trends" subtitle="Monthly ROAS evolution by top channels" onAskAI={onOpenChat} />
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={channelTrends}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[1.5, 5.5]} tickFormatter={(v) => `${v.toFixed(1)}x`} />
                    <Tooltip formatter={(value: number | undefined) => [`${(value ?? 0).toFixed(1)}x`, '']} contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                    <Line type="monotone" dataKey="tiktok" name="TikTok" stroke="#ec4899" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="meta" name="Meta" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="google" name="Google" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="youtube" name="YouTube" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* ── Portfolio ── */}
        {activeTab === 'portfolio' && (
          <>
            {/* Program-level summary */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
              <SectionHeader title="Programs" subtitle="High-level performance by marketing program" onAskAI={onOpenChat} />
              <div className="grid grid-cols-4 gap-4">
                {programSummary.map((p) => (
                  <div key={p.name} className="rounded-xl border border-gray-100 p-4">
                    <div className="text-xs font-semibold text-gray-900 mb-2">{p.name}</div>
                    <div className="grid grid-cols-2 gap-y-2">
                      <div><p className="text-[10px] text-gray-400">Campaigns</p><p className="text-sm font-bold text-gray-900">{p.campaigns}</p></div>
                      <div><p className="text-[10px] text-gray-400">ROAS</p><p className="text-sm font-bold text-gray-900">{p.roas}x</p></div>
                      <div><p className="text-[10px] text-gray-400">Spend</p><p className="text-sm font-bold text-gray-900">{fmtCurrency(p.spend)}</p></div>
                      <div><p className="text-[10px] text-gray-400">Revenue</p><p className="text-sm font-bold text-gray-900">{fmtCurrency(p.revenue)}</p></div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-gray-400">Budget Pacing</span>
                        <span className="text-[10px] font-medium text-gray-600">{p.pacing}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${p.pacing > 90 ? 'bg-amber-400' : p.pacing > 70 ? 'bg-emerald-400' : 'bg-blue-400'}`} style={{ width: `${p.pacing}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Campaign portfolio table */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
              <SectionHeader title="Campaign Portfolio" subtitle="All active campaigns ranked by performance" onAskAI={onOpenChat} />
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wide pb-3 pr-4">Campaign</th>
                      <th className="text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wide pb-3 px-3">Program</th>
                      <th className="text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wide pb-3 px-3">Channel</th>
                      <th className="text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wide pb-3 px-3">Health</th>
                      <th className="text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wide pb-3 px-3">ROAS</th>
                      <th className="text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wide pb-3 px-3">Spend</th>
                      <th className="text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wide pb-3 px-3">Revenue</th>
                      <th className="text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wide pb-3 pl-3">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolioCampaigns.map((c) => (
                      <tr key={c.name} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="py-3 pr-4">
                          <span className="text-xs font-medium text-gray-900">{c.name}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-xs text-gray-500">{c.program}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-xs text-gray-500">{c.channel}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${healthColors[c.health]}`}>
                            {c.health === 'at-risk' ? 'At Risk' : c.health}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className="text-xs font-semibold text-gray-900">{c.roas}x</span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className="text-xs text-gray-600">{fmtCurrency(c.spend)}</span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className="text-xs font-medium text-gray-900">{fmtCurrency(c.revenue)}</span>
                        </td>
                        <td className="py-3 pl-3 text-right">
                          <span className={`text-xs font-medium flex items-center justify-end gap-0.5 ${c.trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                            {c.trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {c.trend >= 0 ? '+' : ''}{c.trend}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── Insights & Forecasts ── */}
        {activeTab === 'insights' && (
          <>
            {/* AI Strategic Insights */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
              <SectionHeader title="AI Strategic Insights" subtitle="Recommendations ranked by projected impact" onAskAI={onOpenChat} />
              <div className="space-y-3">
                {strategicInsights.map((insight, i) => {
                  const icons = { opportunity: <Lightbulb className="w-4 h-4 text-blue-500" />, warning: <AlertTriangle className="w-4 h-4 text-amber-500" />, success: <CheckCircle className="w-4 h-4 text-emerald-500" /> };
                  const borders = { opportunity: 'border-blue-100 bg-blue-50/30', warning: 'border-amber-100 bg-amber-50/30', success: 'border-emerald-100 bg-emerald-50/30' };
                  return (
                    <div key={i} className={`p-4 rounded-xl border ${borders[insight.type]}`}>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex-shrink-0">{icons[insight.type]}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-gray-900">{insight.title}</span>
                            <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full flex-shrink-0 ml-3">{insight.impact}</span>
                          </div>
                          <p className="text-xs text-gray-500 leading-relaxed">{insight.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] text-gray-400">Confidence</span>
                            <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full bg-blue-400" style={{ width: `${insight.confidence}%` }} />
                            </div>
                            <span className="text-[10px] font-medium text-gray-500">{insight.confidence}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Revenue Forecast */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
              <SectionHeader title="Revenue Forecast" subtitle="Projected revenue based on current trajectory and planned spend" onAskAI={onOpenChat} />
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueForecastFull}>
                    <defs>
                      <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => fmtCurrency(v)} />
                    <Tooltip formatter={(value: number | undefined) => [fmtCurrency(value ?? 0), '']} contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                    <Area type="monotone" dataKey="actual" name="Actual" stroke="#10b981" strokeWidth={2} fill="url(#actualGrad)" connectNulls={false} />
                    <Area type="monotone" dataKey="forecast" name="Forecast" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="6 3" fill="url(#forecastGrad)" connectNulls={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
                {forecastData.filter(d => d.forecast).map((d) => (
                  <div key={d.month}>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">{d.month} (Projected)</p>
                    <p className="text-sm font-semibold text-purple-600">{fmtCurrency(d.forecast!)}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      </div>
    </>
  );
}
