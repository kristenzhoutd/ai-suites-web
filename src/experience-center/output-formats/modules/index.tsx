/**
 * Output Module Components — each renders one section of the output panel.
 *
 * Modules are composable and configurable via the module registry.
 * To add a new module:
 * 1. Create a component here
 * 2. Register it in moduleRegistry below
 * 3. Add the module key to scenario configs in scenarioRegistry.ts
 */

import type { OutputData } from '../../../stores/experienceLabStore';
import {
  OutputSection, HeroSummaryCard, KpiStatTile, SegmentCard,
  JourneyStageNode, ChannelRoleCard, DiagnosticFindingCard,
  PriorityActionRow, ImpactCalloutBox, ContextHeaderStrip,
  BriefSectionCard, SignalChipGroup,
} from '../primitives';
import { Sparkles, Lightbulb, Target, Send, ArrowRight, TrendingUp, BarChart3, Shield, Clock } from 'lucide-react';
import type { OutputModule } from '../../registry/types';

// ── Module Props ──

interface ModuleProps {
  output: OutputData;
  scenarioContext?: {
    outcome?: string;
    industry?: string;
    scenario?: string;
    kpi?: string;
  };
}

// ── Scenario Context Header ──

function ScenarioContextHeader({ scenarioContext }: ModuleProps) {
  if (!scenarioContext) return null;
  return <ContextHeaderStrip {...scenarioContext} />;
}

// ── Executive Summary ──

function ExecutiveSummaryModule({ output }: ModuleProps) {
  return (
    <OutputSection title="Executive Summary" icon={<Lightbulb className="w-4 h-4" />}>
      <div className="bg-white rounded-xl p-4 border border-gray-200/60 shadow-sm">
        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{output.executiveSummary}</div>
      </div>
    </OutputSection>
  );
}

// ── KPI Framework ──

function KpiFrameworkModule({ output }: ModuleProps) {
  return (
    <OutputSection title="KPI Framework" icon={<TrendingUp className="w-4 h-4" />}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {output.kpiFramework.map((kpi, i) => (
          <KpiStatTile key={i} type={kpi.type} name={kpi.name} note={kpi.note} />
        ))}
      </div>
    </OutputSection>
  );
}

// ── Campaign Brief ──

function CampaignBriefModule({ output }: ModuleProps) {
  return (
    <OutputSection title={output.scenarioCore.title || 'Campaign Brief'} icon={<Sparkles className="w-4 h-4" />}>
      <div className="space-y-2.5">
        {output.scenarioCore.sections.map((section, i) => (
          <BriefSectionCard key={i} label={section.label} content={section.content} />
        ))}
      </div>
    </OutputSection>
  );
}

// ── Journey Map ──

function JourneyMapModule({ output }: ModuleProps) {
  const stages = output.scenarioCore.sections;
  return (
    <OutputSection title={output.scenarioCore.title || 'Lifecycle Journey'} icon={<ArrowRight className="w-4 h-4" />}>
      <div className="bg-white rounded-xl p-4 border border-gray-200/60 shadow-sm">
        {stages.map((stage, i) => (
          <JourneyStageNode
            key={i}
            index={i}
            name={stage.label}
            content={stage.content}
            isLast={i === stages.length - 1}
          />
        ))}
      </div>
    </OutputSection>
  );
}

// ── Segment Cards ──

function SegmentCardsModule({ output }: ModuleProps) {
  return (
    <OutputSection title="Audience Segments" icon={<Target className="w-4 h-4" />}>
      <div className="space-y-2">
        {output.audienceCards.map((card, i) => (
          <SegmentCard
            key={i}
            rank={i + 1}
            name={card.name}
            description={card.whyItMatters}
            level={card.opportunityLevel}
            action={card.suggestedAction}
          />
        ))}
      </div>
    </OutputSection>
  );
}

// ── Performance Diagnosis ──

function PerformanceDiagnosisModule({ output }: ModuleProps) {
  const sections = output.scenarioCore.sections;
  const severityMap: Record<number, 'critical' | 'warning' | 'info'> = { 0: 'critical', 1: 'warning', 2: 'info', 3: 'info' };
  return (
    <OutputSection title={output.scenarioCore.title || 'Performance Analysis'} icon={<BarChart3 className="w-4 h-4" />}>
      <div className="space-y-2.5">
        {sections.map((section, i) => (
          <DiagnosticFindingCard
            key={i}
            label={section.label}
            content={section.content}
            severity={severityMap[i]}
          />
        ))}
      </div>
    </OutputSection>
  );
}

// ── Next Actions ──

function NextActionsModule({ output }: ModuleProps) {
  return (
    <OutputSection title="Recommended Next Actions" icon={<ArrowRight className="w-4 h-4" />}>
      <div className="space-y-1.5">
        {output.nextActions.map((action, i) => (
          <PriorityActionRow key={i} index={i} action={action.action} priority={action.priority} />
        ))}
      </div>
    </OutputSection>
  );
}

// ── Audience Rationale ──

function AudienceRationaleModule({ output }: ModuleProps) {
  return (
    <OutputSection title="Audience Segments" icon={<Target className="w-4 h-4" />}>
      <div className="space-y-2">
        {output.audienceCards.map((card, i) => (
          <SegmentCard
            key={i}
            name={card.name}
            description={card.whyItMatters}
            level={card.opportunityLevel}
            action={card.suggestedAction}
          />
        ))}
      </div>
    </OutputSection>
  );
}

// ── Channel Strategy ──

function ChannelStrategyModule({ output }: ModuleProps) {
  return (
    <OutputSection title="Channel Strategy" icon={<Send className="w-4 h-4" />}>
      <div className="space-y-2">
        {output.channelStrategy.map((ch, i) => (
          <ChannelRoleCard
            key={i}
            channel={ch.channel}
            role={ch.role}
            messageAngle={ch.messageAngle}
            reason={ch.reason}
          />
        ))}
      </div>
    </OutputSection>
  );
}

// ── Insight Summary ──

function InsightSummaryModule({ output }: ModuleProps) {
  const sections = output.scenarioCore.sections;
  return (
    <OutputSection title={output.scenarioCore.title || 'Insight Summary'} icon={<Lightbulb className="w-4 h-4" />}>
      <div className="space-y-2.5">
        {sections.map((section, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-xl p-4">
            <div className="flex items-start gap-2.5 mb-2">
              <div className="w-5 h-5 rounded-md bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-3 h-3 text-amber-500" />
              </div>
              <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{section.label}</h4>
            </div>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line pl-7">{section.content}</div>
          </div>
        ))}
      </div>
    </OutputSection>
  );
}

// ── Business Impact ──

function BusinessImpactModule({ output }: ModuleProps) {
  return (
    <ImpactCalloutBox title="Projected Business Impact" items={output.insightPanel.businessImpact} />
  );
}

// ── Insight Panel (Why + How Treasure Helps) ──

function InsightPanelModule({ output }: ModuleProps) {
  return (
    <OutputSection title="Why This Recommendation" icon={<Shield className="w-4 h-4" />}>
      <div className="bg-white rounded-xl p-4 border border-gray-200/60 shadow-sm space-y-4">
        <div className="text-sm text-gray-700 leading-relaxed">{output.insightPanel.whyThisRecommendation}</div>
        {output.insightPanel.whatChanged.length > 0 && (
          <div>
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">How your selections shaped this output</div>
            <div className="space-y-1">
              {output.insightPanel.whatChanged.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
        {output.insightPanel.howTreasureHelps.length > 0 && (
          <SignalChipGroup signals={output.insightPanel.howTreasureHelps} label="Powered by Treasure AI" />
        )}
      </div>
    </OutputSection>
  );
}

// ════════════════════════════════════════════════════════════
// Module Registry — maps module keys to components
// ════════════════════════════════════════════════════════════

type ModuleComponent = (props: ModuleProps) => React.ReactNode;

export const moduleRegistry: Record<string, ModuleComponent> = {
  'scenario_context_header': ScenarioContextHeader,
  'executive_summary': ExecutiveSummaryModule,
  'kpi_framework': KpiFrameworkModule,
  'campaign_brief': CampaignBriefModule,
  'journey_map': JourneyMapModule,
  'segment_cards': SegmentCardsModule,
  'performance_diagnosis': PerformanceDiagnosisModule,
  'next_actions': NextActionsModule,
  'audience_rationale': AudienceRationaleModule,
  'channel_strategy': ChannelStrategyModule,
  'insight_summary': InsightSummaryModule,
  'business_impact': BusinessImpactModule,
  'insight_panel': InsightPanelModule,
};

// ════════════════════════════════════════════════════════════
// Output Compositions by format key
// ════════════════════════════════════════════════════════════

export const outputCompositions: Record<string, string[]> = {
  'campaign_brief': [
    'scenario_context_header',
    'executive_summary',
    'campaign_brief',
    'audience_rationale',
    'channel_strategy',
    'kpi_framework',
    'business_impact',
    'next_actions',
    'insight_panel',
  ],
  'journey_map': [
    'scenario_context_header',
    'executive_summary',
    'journey_map',
    'audience_rationale',
    'kpi_framework',
    'business_impact',
    'next_actions',
    'insight_panel',
  ],
  'segment_cards': [
    'scenario_context_header',
    'executive_summary',
    'segment_cards',
    'kpi_framework',
    'business_impact',
    'next_actions',
    'insight_panel',
  ],
  'performance_diagnosis': [
    'scenario_context_header',
    'executive_summary',
    'performance_diagnosis',
    'audience_rationale',
    'channel_strategy',
    'kpi_framework',
    'business_impact',
    'next_actions',
    'insight_panel',
  ],
  'insight_summary': [
    'scenario_context_header',
    'executive_summary',
    'insight_summary',
    'segment_cards',
    'kpi_framework',
    'business_impact',
    'next_actions',
    'insight_panel',
  ],
};

// Default composition if outputFormatKey not found
const DEFAULT_COMPOSITION = [
  'scenario_context_header',
  'executive_summary',
  'campaign_brief',
  'audience_rationale',
  'kpi_framework',
  'next_actions',
  'insight_panel',
];

// ════════════════════════════════════════════════════════════
// Modular Output Renderer
// ════════════════════════════════════════════════════════════

export function ModularOutputRenderer({ output, outputFormatKey, visibleSections, scenarioContext }: {
  output: OutputData;
  outputFormatKey?: string;
  visibleSections: number;
  scenarioContext?: ModuleProps['scenarioContext'];
}) {
  const composition = (outputFormatKey && outputCompositions[outputFormatKey]) || DEFAULT_COMPOSITION;

  return (
    <>
      {/* Hero summary — always first */}
      <div className={`transition-all duration-500 ${visibleSections > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <HeroSummaryCard
          headline={output.summaryBanner.topRecommendation}
          goal={output.summaryBanner.goal}
          audience={output.summaryBanner.audience}
          impact={output.summaryBanner.impactFraming}
        />
      </div>

      {/* Composable modules */}
      {composition.map((moduleKey, i) => {
        const Module = moduleRegistry[moduleKey];
        if (!Module) return null;
        return (
          <div
            key={moduleKey}
            className={`transition-all duration-500 ${visibleSections > i + 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <Module output={output} scenarioContext={scenarioContext} />
          </div>
        );
      })}

      {/* Trust footer */}
      <div className="mt-4 text-center text-[11px] text-gray-400">
        AI-generated recommendation designed for human review. Built on trusted, traceable context.
      </div>
    </>
  );
}
