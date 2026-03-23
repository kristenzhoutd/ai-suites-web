/**
 * Reusable visual primitives for Experience Center output modules.
 * These form the shared design system across all output formats.
 */

import { Sparkles, TrendingUp, Target, ArrowRight, AlertTriangle, Zap, BarChart3 } from 'lucide-react';

// ── Section Wrapper ──

export function OutputSection({ title, icon, children, className = '' }: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-5 ${className}`}>
      <div className="flex items-center gap-2 mb-2.5">
        {icon && <div className="text-gray-400">{icon}</div>}
        <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ── Hero Summary Card ──

export function HeroSummaryCard({ headline, supporting, goal, audience, impact, label = 'AI-Generated Recommendation' }: {
  headline: string;
  supporting?: string;
  goal?: string;
  audience?: string;
  impact?: string;
  label?: string;
}) {
  return (
    <div className="border border-gray-200/60 rounded-2xl p-5 mb-5 bg-white shadow-sm">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4 text-blue-500" />
        </div>
        <div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-1">{label}</div>
          <div className="text-sm font-semibold text-gray-900 leading-snug">{headline}</div>
          {supporting && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{supporting}</p>}
        </div>
      </div>
      {(goal || audience) && (
        <div className="flex items-center gap-3 pt-3 border-t border-gray-100 text-[11px] text-gray-400">
          {goal && <span>Goal: {goal}</span>}
          {goal && audience && <span className="w-1 h-1 rounded-full bg-gray-300" />}
          {audience && <span>Audience: {audience}</span>}
        </div>
      )}
      {impact && <div className="mt-1.5 text-sm text-blue-600 font-medium">{impact}</div>}
    </div>
  );
}

// ── KPI Stat Tile ──

const KPI_COLORS: Record<string, string> = {
  'Primary': 'text-blue-600 border-blue-100 bg-blue-50/40',
  'Secondary': 'text-indigo-500 border-indigo-100 bg-indigo-50/40',
  'Leading Indicator': 'text-amber-600 border-amber-100 bg-amber-50/40',
  'Optimization': 'text-emerald-600 border-emerald-100 bg-emerald-50/40',
};

export function KpiStatTile({ type, name, note }: { type: string; name: string; note: string }) {
  const colorClass = KPI_COLORS[type] || 'text-gray-500 border-gray-100 bg-gray-50/40';
  return (
    <div className={`border rounded-xl p-3.5 ${colorClass}`}>
      <div className="text-[10px] font-semibold uppercase tracking-wider mb-1">{type}</div>
      <div className="text-sm font-semibold text-gray-900 mb-0.5">{name}</div>
      <div className="text-[11px] text-gray-500">{note}</div>
    </div>
  );
}

// ── Ranked Segment Card ──

const LEVEL_COLORS: Record<string, string> = {
  'High': 'bg-green-50 text-green-700',
  'Medium': 'bg-amber-50 text-amber-700',
  'Low': 'bg-gray-100 text-gray-500',
};

export function SegmentCard({ name, description, level, action, rank }: {
  name: string;
  description: string;
  level: string;
  action: string;
  rank?: number;
}) {
  return (
    <div className="border border-gray-100 rounded-xl p-3.5 bg-white hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          {rank !== undefined && (
            <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
              {rank}
            </span>
          )}
          <span className="font-semibold text-sm text-gray-900">{name}</span>
        </div>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${LEVEL_COLORS[level] || LEVEL_COLORS['Low']}`}>
          {level}
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-1.5 leading-relaxed">{description}</p>
      <p className="text-xs text-blue-600 font-medium">{action}</p>
    </div>
  );
}

// ── Journey Stage Node ──

export function JourneyStageNode({ index, name, content, isLast = false }: {
  index: number;
  name: string;
  content: string;
  isLast?: boolean;
}) {
  const lines = content.split('\n').filter(l => l.trim());
  return (
    <div className="flex gap-3">
      {/* Timeline spine */}
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-xs font-bold text-blue-600 flex-shrink-0">
          {index + 1}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-blue-100 mt-1" />}
      </div>
      {/* Stage content */}
      <div className={`flex-1 bg-white border border-gray-100 rounded-xl p-3.5 ${!isLast ? 'mb-2' : ''}`}>
        <h4 className="text-sm font-semibold text-gray-900 mb-2">{name}</h4>
        <div className="space-y-1">
          {lines.map((line, i) => {
            const [key, ...valueParts] = line.split(':');
            const value = valueParts.join(':').trim();
            return value ? (
              <div key={i} className="text-xs">
                <span className="text-gray-400 font-medium">{key.trim()}:</span>{' '}
                <span className="text-gray-700">{value}</span>
              </div>
            ) : (
              <p key={i} className="text-xs text-gray-700">{line}</p>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Channel Role Card ──

export function ChannelRoleCard({ channel, role, messageAngle, reason }: {
  channel: string;
  role: string;
  messageAngle: string;
  reason: string;
}) {
  return (
    <div className="border border-gray-100 rounded-xl p-3.5 bg-white hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-md bg-indigo-50 flex items-center justify-center flex-shrink-0">
          <Zap className="w-3.5 h-3.5 text-indigo-500" />
        </div>
        <span className="text-sm font-semibold text-gray-900">{channel}</span>
        <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full ml-auto">{role}</span>
      </div>
      <p className="text-xs text-gray-700 mb-1">{messageAngle}</p>
      <p className="text-[11px] text-gray-400 italic">{reason}</p>
    </div>
  );
}

// ── Diagnostic Finding Card ──

export function DiagnosticFindingCard({ label, content, severity }: {
  label: string;
  content: string;
  severity?: 'critical' | 'warning' | 'info';
}) {
  const borderColor = severity === 'critical' ? 'border-l-red-400' : severity === 'warning' ? 'border-l-amber-400' : 'border-l-blue-400';
  return (
    <div className={`bg-white border border-gray-100 border-l-4 ${borderColor} rounded-lg p-3.5`}>
      <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</h4>
      <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{content}</div>
    </div>
  );
}

// ── Priority Action Row ──

const PRIORITY_COLORS: Record<string, string> = {
  'Do now': 'bg-green-50 text-green-700 border-green-200',
  'Test next': 'bg-blue-50 text-blue-700 border-blue-200',
  'Scale later': 'bg-gray-50 text-gray-500 border-gray-200',
};

export function PriorityActionRow({ action, priority, index }: { action: string; priority: string; index: number }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-shadow">
      <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
        {index + 1}
      </span>
      <span className="text-sm text-gray-700 flex-1">{action}</span>
      <span className={`flex-shrink-0 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${PRIORITY_COLORS[priority] || PRIORITY_COLORS['Scale later']}`}>
        {priority}
      </span>
    </div>
  );
}

// ── Signal Chip Group ──

export function SignalChipGroup({ signals, label = 'Data Signals' }: { signals: string[]; label?: string }) {
  return (
    <div>
      {label && <div className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-2">{label}</div>}
      <div className="flex flex-wrap gap-1.5">
        {signals.map((s, i) => (
          <span key={i} className="text-[11px] px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-600">{s}</span>
        ))}
      </div>
    </div>
  );
}

// ── Impact Callout Box ──

export function ImpactCalloutBox({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/60 border border-blue-100 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2.5">
        <TrendingUp className="w-4 h-4 text-blue-500" />
        <h4 className="text-xs font-semibold text-blue-900 uppercase tracking-wider">{title}</h4>
      </div>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
            <span className="text-sm text-blue-900/80">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Context Header Strip ──

export function ContextHeaderStrip({ outcome, industry, scenario, kpi }: {
  outcome?: string;
  industry?: string;
  scenario?: string;
  kpi?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 pb-3 border-b border-gray-100">
      {outcome && <span className="text-[11px] px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">{outcome}</span>}
      {industry && <span className="text-[11px] px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">{industry}</span>}
      {scenario && <span className="text-[11px] px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">{scenario}</span>}
      {kpi && (
        <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium flex items-center gap-1 ml-auto">
          <Target className="w-3 h-3" />
          {kpi}
        </span>
      )}
    </div>
  );
}

// ── Brief Section Card ──

export function BriefSectionCard({ label, content }: { label: string; content: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4">
      <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">{label}</h4>
      <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{content}</div>
    </div>
  );
}

// ── Comparison Card ──

export function ComparisonCard({ labelA, labelB, valueA, valueB, metric }: {
  labelA: string;
  labelB: string;
  valueA: string;
  valueB: string;
  metric: string;
}) {
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3.5 pt-3 pb-1">{metric}</div>
      <div className="grid grid-cols-2 divide-x divide-gray-100">
        <div className="p-3.5">
          <div className="text-[10px] text-gray-400 mb-1">{labelA}</div>
          <div className="text-sm font-semibold text-gray-900">{valueA}</div>
        </div>
        <div className="p-3.5">
          <div className="text-[10px] text-gray-400 mb-1">{labelB}</div>
          <div className="text-sm font-semibold text-blue-600">{valueB}</div>
        </div>
      </div>
    </div>
  );
}
