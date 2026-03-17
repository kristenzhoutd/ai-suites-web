import { useState } from 'react';
import { Shield, Sparkles, Target, X, DollarSign, TrendingUp, ShoppingCart } from 'lucide-react';
import type { PerformanceGuardrails } from '../../types/program';

type PromptVariant = 'command-center' | 'detail-panel' | 'insights';

interface GuardrailsPromptCardProps {
  variant: PromptVariant;
  onSetGuardrails: (guardrails: PerformanceGuardrails) => void;
  onDismiss?: () => void;
  suggestedTargets?: Partial<PerformanceGuardrails>;
}

export default function GuardrailsPromptCard({
  variant,
  onSetGuardrails,
  onDismiss,
  suggestedTargets,
}: GuardrailsPromptCardProps) {
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [draft, setDraft] = useState<Partial<PerformanceGuardrails>>(suggestedTargets || {});

  const handleSave = () => {
    const cleaned: PerformanceGuardrails = { source: 'manual' };
    if (draft.targetCpa) cleaned.targetCpa = draft.targetCpa;
    if (draft.targetRoas) cleaned.targetRoas = draft.targetRoas;
    if (draft.targetConversions) cleaned.targetConversions = draft.targetConversions;
    if (draft.budgetCap) cleaned.budgetCap = draft.budgetCap;
    onSetGuardrails(cleaned);
    setIsSettingUp(false);
  };

  const handleUseSuggested = () => {
    if (suggestedTargets) {
      onSetGuardrails({ ...suggestedTargets, source: 'ai-suggested' });
    }
  };

  // Command center variant: prominent callout card
  if (variant === 'command-center') {
    return (
      <div className="relative border border-[#D4DFFF] bg-gradient-to-r from-[#FAFBFF] to-[#F0F4FF] rounded-xl p-5 mb-4">
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-md text-gray-400 cursor-pointer hover:bg-white/60 transition-colors border-none bg-transparent"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#3B6FD4]/10 flex items-center justify-center flex-shrink-0">
            <Shield className="w-4.5 h-4.5 text-[#3B6FD4]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-[#212327] m-0 mb-1">Unlock AI Diagnosis</h3>
            <p className="text-xs text-[#636A77] m-0 mb-3 leading-relaxed">
              We're already collecting campaign performance data. Set performance guardrails to enable AI-powered diagnosis and optimization suggestions.
            </p>

            {isSettingUp ? (
              <InlineSetupForm
                draft={draft}
                setDraft={setDraft}
                onSave={handleSave}
                onCancel={() => setIsSettingUp(false)}
              />
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setIsSettingUp(true)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#212327] bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <Target className="w-3 h-3" />
                  Set guardrails
                </button>
                {suggestedTargets && (suggestedTargets.targetCpa || suggestedTargets.targetRoas) && (
                  <button
                    onClick={handleUseSuggested}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#3B6FD4] bg-white border border-[#D4DFFF] rounded-lg cursor-pointer hover:bg-[#F0F4FF] transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    Use AI-suggested targets
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Detail panel variant: compact section
  if (variant === 'detail-panel') {
    return (
      <div className="px-5 py-4 border-b border-[#eff2f8]">
        <div className="bg-[#FAFBFF] border border-[#E2E8F5] rounded-lg p-3.5">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-3.5 h-3.5 text-[#3B6FD4]" />
            <span className="text-xs font-semibold text-[#212327]">Performance guardrails not configured</span>
          </div>
          <p className="text-[11px] text-[#636A77] m-0 mb-2.5 leading-relaxed">
            Set guardrails to enable AI optimization suggestions, underperformance alerts, and target vs. actual analysis.
          </p>

          {isSettingUp ? (
            <InlineSetupForm
              draft={draft}
              setDraft={setDraft}
              onSave={handleSave}
              onCancel={() => setIsSettingUp(false)}
              compact
            />
          ) : (
            <button
              onClick={() => setIsSettingUp(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-[#3B6FD4] bg-white border border-[#D4DFFF] rounded-md cursor-pointer hover:bg-[#F0F4FF] transition-colors"
            >
              <Target className="w-3 h-3" />
              Set guardrails
            </button>
          )}
        </div>
      </div>
    );
  }

  // Insights variant: locked/empty state
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex flex-col items-center text-center py-4">
        <div className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center mb-3">
          <Shield className="w-5 h-5 text-[#878F9E]" />
        </div>
        <h3 className="text-sm font-semibold text-[#212327] m-0 mb-1">AI Diagnosis Not Enabled Yet</h3>
        <p className="text-xs text-[#878F9E] m-0 mb-4 max-w-[260px] leading-relaxed">
          Set performance guardrails to generate diagnostic insights and optimization recommendations.
        </p>

        {isSettingUp ? (
          <div className="w-full text-left">
            <InlineSetupForm
              draft={draft}
              setDraft={setDraft}
              onSave={handleSave}
              onCancel={() => setIsSettingUp(false)}
              compact
            />
          </div>
        ) : (
          <button
            onClick={() => setIsSettingUp(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#3B6FD4] bg-[#F0F4FF] border border-[#D4DFFF] rounded-lg cursor-pointer hover:bg-[#E5ECFF] transition-colors"
          >
            <Shield className="w-3 h-3" />
            Set guardrails to enable AI diagnosis
          </button>
        )}
      </div>
    </div>
  );
}

function InlineSetupForm({
  draft,
  setDraft,
  onSave,
  onCancel,
  compact,
}: {
  draft: Partial<PerformanceGuardrails>;
  setDraft: (fn: (prev: Partial<PerformanceGuardrails>) => Partial<PerformanceGuardrails>) => void;
  onSave: () => void;
  onCancel: () => void;
  compact?: boolean;
}) {
  const fields = [
    { key: 'targetCpa' as const, label: 'Target CPA', prefix: '$', placeholder: '22' },
    { key: 'targetRoas' as const, label: 'Target ROAS', suffix: 'x', placeholder: '3.4' },
    { key: 'targetConversions' as const, label: 'Conversions', placeholder: '5,000' },
    { key: 'budgetCap' as const, label: 'Budget Cap', prefix: '$', placeholder: '50,000' },
  ];

  return (
    <div className="flex flex-col gap-2.5">
      <div className={`grid ${compact ? 'grid-cols-2' : 'grid-cols-4'} gap-2`}>
        {fields.map(({ key, label, prefix, suffix, placeholder }) => (
          <div key={key}>
            <label className="block text-[10px] font-medium text-[#878F9E] mb-1">{label}</label>
            <div className="relative">
              {prefix && <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">{prefix}</span>}
              <input
                type="text"
                value={draft[key] ?? ''}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9.]/g, '');
                  const num = parseFloat(raw);
                  setDraft(prev => ({ ...prev, [key]: isNaN(num) ? undefined : num }));
                }}
                placeholder={placeholder}
                className={`w-full ${prefix ? 'pl-5' : 'pl-2'} ${suffix ? 'pr-5' : 'pr-2'} py-1.5 border border-gray-200 rounded-md text-xs text-gray-900 outline-none focus:border-[#3B6FD4] transition-all placeholder:text-gray-300`}
              />
              {suffix && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">{suffix}</span>}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={onSave}
          className="px-3 py-1.5 text-xs font-medium text-white bg-[#212327] rounded-md cursor-pointer hover:bg-gray-700 transition-colors border-none"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-xs font-medium text-gray-500 bg-transparent border-none cursor-pointer hover:text-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
