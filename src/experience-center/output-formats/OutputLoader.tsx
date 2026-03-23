/**
 * OutputLoader — artifact-aware skeleton loading state for the output panel.
 * Mirrors the actual output structure for smooth visual transitions.
 */

import { useState, useEffect } from 'react';
import { Sparkles, Target, TrendingUp, Send, ArrowRight, BarChart3, Lightbulb, Presentation } from 'lucide-react';

const shimmer = 'animate-pulse bg-gray-200/60';
const shimmerLight = 'animate-pulse bg-gray-100';

// ── Shared Primitives ──

function SkeletonLine({ width = 'w-full', height = 'h-2.5' }: { width?: string; height?: string }) {
  return <div className={`${shimmer} rounded-full ${width} ${height}`} />;
}

function SkeletonSection({ icon, titleWidth = 'w-28' }: { icon: React.ReactNode; titleWidth?: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="text-gray-300">{icon}</div>
      <div className={`${shimmer} rounded-full ${titleWidth} h-2`} />
    </div>
  );
}

// ── Hero Card Skeleton ──

function HeroSkeleton() {
  return (
    <div className="border border-gray-100 rounded-2xl p-4 mb-4 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-7 h-7 rounded-lg ${shimmerLight} flex-shrink-0`} />
        <div className="flex-1 space-y-2">
          <SkeletonLine width="w-32" height="h-2" />
          <SkeletonLine width="w-full" height="h-3" />
          <SkeletonLine width="w-4/5" height="h-3" />
        </div>
      </div>
      <div className="pt-3 border-t border-gray-100 space-y-2">
        <div className="flex items-start gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${shimmer} mt-1 flex-shrink-0`} />
          <SkeletonLine width="w-3/4" />
        </div>
        <div className="flex items-start gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${shimmer} mt-1 flex-shrink-0`} />
          <SkeletonLine width="w-2/3" />
        </div>
      </div>
      <div className="pt-3 mt-3 border-t border-gray-100 flex gap-2">
        <div className={`${shimmerLight} rounded-full w-24 h-5`} />
        <div className={`${shimmerLight} rounded-full w-16 h-5`} />
        <div className={`${shimmerLight} rounded-full w-36 h-5`} />
      </div>
    </div>
  );
}

// ── Module Skeletons ──

function SegmentCardsSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      <SkeletonSection icon={<Target className="w-4 h-4" />} />
      <div className="space-y-2">
        {[85, 65, 40].map((w, i) => (
          <div key={i} className="border border-gray-100 rounded-xl p-3 bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full ${shimmerLight}`} />
                <SkeletonLine width="w-28" height="h-3" />
              </div>
              <div className={`${shimmerLight} rounded-full w-12 h-4`} />
            </div>
            <SkeletonLine width="w-full" />
            <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${shimmer}`} style={{ width: `${w}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KpiSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      <SkeletonSection icon={<TrendingUp className="w-4 h-4" />} titleWidth="w-24" />
      <div className="grid grid-cols-2 gap-2">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`rounded-xl p-3 border border-gray-100 ${shimmerLight}`}>
            <SkeletonLine width="w-16" height="h-2" />
            <SkeletonLine width="w-12" height="h-4" />
            <SkeletonLine width="w-20" height="h-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ChannelSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      <SkeletonSection icon={<Send className="w-4 h-4" />} titleWidth="w-28" />
      <div className={`h-2.5 rounded-full ${shimmerLight} mb-3`}>
        <div className="flex h-full">
          <div className={`h-full rounded-l-full ${shimmer} w-2/5`} />
          <div className={`h-full ${shimmerLight} w-1/4`} />
          <div className={`h-full rounded-r-full ${shimmer} w-1/3`} style={{ opacity: 0.5 }} />
        </div>
      </div>
      <div className="space-y-2">
        {[0, 1, 2].map(i => (
          <div key={i} className="border border-gray-100 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <div className={`w-6 h-6 rounded-md ${shimmerLight}`} />
              <SkeletonLine width="w-20" height="h-3" />
              <div className={`${shimmerLight} rounded-full w-16 h-4 ml-auto`} />
            </div>
            <SkeletonLine width="w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

function DiagnosisSkeleton() {
  const borders = ['border-l-red-200', 'border-l-amber-200', 'border-l-blue-200'];
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      <SkeletonSection icon={<BarChart3 className="w-4 h-4" />} titleWidth="w-32" />
      <div className="space-y-2">
        {borders.map((border, i) => (
          <div key={i} className={`border border-gray-100 border-l-4 ${border} rounded-lg p-3`}>
            <div className="flex items-center justify-between mb-2">
              <SkeletonLine width="w-32" height="h-2" />
              <div className={`${shimmerLight} rounded-full w-14 h-4`} />
            </div>
            <SkeletonLine width="w-full" />
            <SkeletonLine width="w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

function JourneySkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      <SkeletonSection icon={<ArrowRight className="w-4 h-4" />} titleWidth="w-28" />
      {/* Timeline strip */}
      <div className="flex items-center gap-0.5 mb-3">
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div className={`w-full h-1.5 rounded-full ${shimmer}`} />
            <SkeletonLine width="w-12" height="h-2" />
          </div>
        ))}
      </div>
      {/* Stage nodes */}
      {[0, 1, 2, 3].map(i => (
        <div key={i} className="flex gap-3 mb-2">
          <div className="flex flex-col items-center">
            <div className={`w-7 h-7 rounded-full border-2 border-gray-200 ${shimmerLight}`} />
            {i < 3 && <div className="w-0.5 flex-1 bg-gray-100 mt-1" />}
          </div>
          <div className="flex-1 border border-gray-100 rounded-xl p-3">
            <SkeletonLine width="w-24" height="h-3" />
            <SkeletonLine width="w-full" />
            <SkeletonLine width="w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ActionsSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      <SkeletonSection icon={<ArrowRight className="w-4 h-4" />} titleWidth="w-36" />
      <div className="space-y-1.5">
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl">
            <div className={`w-5 h-5 rounded-full ${shimmerLight}`} />
            <SkeletonLine width="w-3/4" />
            <div className={`${shimmerLight} rounded-full w-14 h-4 ml-auto`} />
          </div>
        ))}
      </div>
    </div>
  );
}

function BriefSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      <SkeletonSection icon={<Sparkles className="w-4 h-4" />} titleWidth="w-24" />
      <div className="space-y-2">
        {[0, 1, 2].map(i => (
          <div key={i} className="bg-white border border-gray-100 rounded-xl p-3.5">
            <SkeletonLine width="w-28" height="h-2" />
            <div className="mt-2 space-y-1.5">
              <SkeletonLine width="w-full" />
              <SkeletonLine width="w-5/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImpactSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      <SkeletonSection icon={<TrendingUp className="w-4 h-4" />} titleWidth="w-32" />
      <div className={`rounded-xl p-4 border border-gray-100 ${shimmerLight}`}>
        <div className="grid grid-cols-2 gap-2">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="bg-white/80 rounded-lg p-3 border border-gray-100/50">
              <div className="flex items-start gap-2">
                <div className={`w-6 h-6 rounded-md ${shimmer}`} />
                <div className="flex-1 space-y-1.5">
                  <SkeletonLine width="w-full" />
                  <SkeletonLine width="w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Slide Skeleton ──

function SlideSkeleton() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Presentation className="w-4 h-4 text-gray-300" />
        <SkeletonLine width="w-40" height="h-3" />
      </div>
      {/* Slide card skeleton */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden aspect-[16/10] flex flex-col">
        <div className="bg-gradient-to-r from-gray-200 to-gray-100 px-5 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${shimmer}`} />
            <SkeletonLine width="w-16" height="h-2" />
          </div>
          <SkeletonLine width="w-8" height="h-2" />
        </div>
        <div className="flex-1 p-6 flex flex-col items-center justify-center">
          <div className={`w-10 h-10 rounded-xl ${shimmerLight} mb-4`} />
          <SkeletonLine width="w-48" height="h-4" />
          <div className="mt-2">
            <SkeletonLine width="w-56" height="h-2.5" />
          </div>
        </div>
      </div>
      {/* Dot indicators skeleton */}
      <div className="flex items-center justify-center mt-3 gap-1.5">
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className={`w-2 h-2 rounded-full ${i === 0 ? shimmer : shimmerLight}`} />
        ))}
      </div>
    </div>
  );
}

// ── Composition by output type ──

const OUTPUT_SKELETONS: Record<string, React.FC[]> = {
  campaign_brief: [BriefSkeleton, SegmentCardsSkeleton, ChannelSkeleton, KpiSkeleton, ActionsSkeleton],
  journey_map: [JourneySkeleton, KpiSkeleton, ImpactSkeleton, ActionsSkeleton],
  segment_cards: [SegmentCardsSkeleton, KpiSkeleton, ImpactSkeleton, ActionsSkeleton],
  performance_diagnosis: [DiagnosisSkeleton, ChannelSkeleton, KpiSkeleton, ActionsSkeleton],
  insight_summary: [BriefSkeleton, SegmentCardsSkeleton, KpiSkeleton, ActionsSkeleton],
};

const DEFAULT_SKELETONS = [BriefSkeleton, SegmentCardsSkeleton, KpiSkeleton, ActionsSkeleton];

// ── Main Component ──

export default function OutputLoader({ variant = 'output', outputFormatKey }: {
  variant?: 'output' | 'slides';
  outputFormatKey?: string;
}) {
  const [stageIndex, setStageIndex] = useState(0);
  const messages = variant === 'slides'
    ? ['Preparing slide outline', 'Mapping content to slides', 'Building slide deck', 'Rendering slide preview']
    : ['Preparing recommendation', 'Building strategy summary', 'Analyzing audience segments', 'Assembling KPI framework', 'Rendering output modules'];

  useEffect(() => {
    const interval = setInterval(() => setStageIndex(prev => (prev + 1) % messages.length), 2500);
    return () => clearInterval(interval);
  }, [messages.length]);

  if (variant === 'slides') {
    return (
      <div className="space-y-4">
        {/* Stage message */}
        <div className="text-center mb-2">
          <p className="text-xs text-gray-400 animate-pulse">{messages[stageIndex]}</p>
        </div>
        <SlideSkeleton />
      </div>
    );
  }

  const skeletons = (outputFormatKey && OUTPUT_SKELETONS[outputFormatKey]) || DEFAULT_SKELETONS;

  return (
    <div>
      {/* Stage message */}
      <div className="text-center mb-4">
        <p className="text-xs text-gray-400 animate-pulse">{messages[stageIndex]}</p>
      </div>
      {/* Hero skeleton — always first */}
      <HeroSkeleton />
      {/* Module skeletons based on output type */}
      {skeletons.map((Skeleton, i) => (
        <Skeleton key={i} />
      ))}
    </div>
  );
}
