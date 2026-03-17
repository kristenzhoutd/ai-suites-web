import { useState, useCallback } from 'react';
import { Shield, Sparkles, ChevronDown, ChevronUp, X, Target, DollarSign, TrendingUp, ShoppingCart } from 'lucide-react';
import type { PerformanceGuardrails } from '../../types/program';
import type { Blueprint } from '../../../electron/utils/ipc-types';

interface PerformanceGuardrailsSectionProps {
  guardrails?: PerformanceGuardrails;
  onSave: (guardrails: PerformanceGuardrails) => void;
  onClear: () => void;
  blueprint?: Blueprint;
}

function generateAISuggestions(blueprint?: Blueprint): Partial<PerformanceGuardrails> {
  if (!blueprint) return {};
  const budgetNum = parseFloat(blueprint.budget.amount.replace(/[^0-9.]/g, '')) || 0;
  const multiplier = blueprint.budget.amount.toUpperCase().includes('K') ? 1000 :
    blueprint.budget.amount.toUpperCase().includes('M') ? 1000000 : 1;
  const totalBudget = budgetNum * multiplier;

  const roasNum = parseFloat((blueprint.metrics.roas || '').replace(/[^0-9.]/g, '')) || 0;
  const convStr = blueprint.metrics.conversions || '';
  const convNum = parseFloat(convStr.replace(/[^0-9.]/g, '')) || 0;
  const convMultiplier = convStr.toUpperCase().includes('K') ? 1000 :
    convStr.toUpperCase().includes('M') ? 1000000 : 1;
  const totalConv = convNum * convMultiplier || 0;
  const cpa = totalConv > 0 ? Math.round(totalBudget / totalConv) : 0;

  return {
    targetCpa: cpa > 0 ? cpa : undefined,
    targetRoas: roasNum > 0 ? parseFloat(roasNum.toFixed(1)) : undefined,
    targetConversions: totalConv > 0 ? Math.round(totalConv) : undefined,
    budgetCap: totalBudget > 0 ? Math.round(totalBudget) : undefined,
  };
}

export default function PerformanceGuardrailsSection({
  guardrails,
  onSave,
  onClear,
  blueprint,
}: PerformanceGuardrailsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(!!guardrails);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<Partial<PerformanceGuardrails>>(guardrails || {});

  const hasGuardrails = guardrails && (guardrails.targetCpa || guardrails.targetRoas || guardrails.targetConversions || guardrails.budgetCap);

  const handleUseAISuggestions = useCallback(() => {
    const suggestions = generateAISuggestions(blueprint);
    setDraft(suggestions);
    setIsEditing(true);
    setIsExpanded(true);
  }, [blueprint]);

  const handleSave = useCallback(() => {
    const cleaned: PerformanceGuardrails = {};
    if (draft.targetCpa) cleaned.targetCpa = draft.targetCpa;
    if (draft.targetRoas) cleaned.targetRoas = draft.targetRoas;
    if (draft.targetConversions) cleaned.targetConversions = draft.targetConversions;
    if (draft.budgetCap) cleaned.budgetCap = draft.budgetCap;
    cleaned.source = draft.source || 'manual';
    onSave(cleaned);
    setIsEditing(false);
  }, [draft, onSave]);

  const handleCancel = useCallback(() => {
    setDraft(guardrails || {});
    setIsEditing(false);
    if (!hasGuardrails) setIsExpanded(false);
  }, [guardrails, hasGuardrails]);

  const fields = [
    { key: 'targetCpa' as const, label: 'Target CPA', icon: Target, prefix: '$', placeholder: '22' },
    { key: 'targetRoas' as const, label: 'Target ROAS', icon: TrendingUp, suffix: 'x', placeholder: '3.4' },
    { key: 'targetConversions' as const, label: 'Target Conversions', icon: ShoppingCart, placeholder: '5,000' },
    { key: 'budgetCap' as const, label: 'Budget Guardrail', icon: DollarSign, prefix: '$', placeholder: '50,000' },
  ];

  return (
    <div className="bg-white rounded-xl px-5 py-4 shadow-sm relative">
      <div className="flex items-center justify-between mb-1">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 border-none bg-transparent cursor-pointer p-0"
        >
          <Shield className="w-4 h-4 text-[#636A77]" />
          <h2 className="text-sm font-semibold text-gray-900 m-0">Performance Guardrails</h2>
          <span className="text-xs font-normal text-[#878F9E] bg-[#F3F4F6] px-1.5 py-0.5 rounded">optional</span>
          {hasGuardrails && (
            <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
          )}
        </button>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-6 h-6 flex items-center justify-center rounded-md text-[#878F9E] cursor-pointer hover:bg-gray-100 transition-colors border-none bg-transparent"
        >
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {!isExpanded && !hasGuardrails && (
        <p className="text-xs text-[#878F9E] m-0 mt-1">
          Set performance guardrails now to enable stronger post-launch AI diagnosis and optimization suggestions.
        </p>
      )}

      {isExpanded && (
        <div className="mt-3">
          {/* Display mode: show saved guardrails */}
          {hasGuardrails && !isEditing && (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                {fields.map(({ key, label, icon: Icon, prefix, suffix }) => {
                  const value = guardrails?.[key];
                  if (!value) return null;
                  return (
                    <div key={key} className="flex items-center gap-2.5 rounded-lg border border-gray-100 bg-[#F7F8FB] px-3 py-2.5">
                      <Icon className="w-3.5 h-3.5 text-[#636A77] flex-shrink-0" />
                      <div>
                        <div className="text-[10px] font-medium text-[#878F9E] uppercase tracking-wide">{label}</div>
                        <div className="text-sm font-semibold text-[#212327]">
                          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {guardrails?.source === 'ai-suggested' && (
                <div className="flex items-center gap-1.5 text-[10px] text-[#878F9E]">
                  <Sparkles className="w-3 h-3" />
                  AI-suggested targets
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => { setDraft(guardrails || {}); setIsEditing(true); }}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={onClear}
                  className="px-3 py-1.5 text-xs font-medium text-gray-500 bg-transparent border-none cursor-pointer hover:text-gray-700 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Empty state / editing state */}
          {(!hasGuardrails || isEditing) && (
            <div className="flex flex-col gap-3">
              {!isEditing && (
                <p className="text-xs text-[#878F9E] m-0">
                  Set performance guardrails now to enable stronger post-launch AI diagnosis and optimization suggestions.
                </p>
              )}

              {isEditing && (
                <div className="grid grid-cols-2 gap-3">
                  {fields.map(({ key, label, icon: Icon, prefix, suffix, placeholder }) => (
                    <div key={key}>
                      <label className="flex items-center gap-1.5 text-[11px] font-medium text-[#636A77] mb-1.5">
                        <Icon className="w-3 h-3" />
                        {label}
                      </label>
                      <div className="relative">
                        {prefix && (
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">{prefix}</span>
                        )}
                        <input
                          type="text"
                          value={draft[key] ?? ''}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/[^0-9.]/g, '');
                            const num = parseFloat(raw);
                            setDraft(prev => ({ ...prev, [key]: isNaN(num) ? undefined : num }));
                          }}
                          placeholder={placeholder}
                          className={`w-full ${prefix ? 'pl-7' : 'pl-3'} ${suffix ? 'pr-7' : 'pr-3'} py-2 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:border-[#3B6FD4] focus:ring-2 focus:ring-[#3B6FD4]/10 transition-all placeholder:text-gray-300`}
                        />
                        {suffix && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">{suffix}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 flex-wrap">
                {!isEditing && (
                  <>
                    <button
                      onClick={() => { setDraft({}); setIsEditing(true); }}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#212327] bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <Target className="w-3 h-3" />
                      Set targets manually
                    </button>
                    <button
                      onClick={handleUseAISuggestions}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#3B6FD4] bg-[#F0F4FF] border border-[#D4DFFF] rounded-lg cursor-pointer hover:bg-[#E5ECFF] transition-colors"
                    >
                      <Sparkles className="w-3 h-3" />
                      Use AI-suggested targets
                    </button>
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="px-3 py-2 text-xs font-medium text-[#878F9E] bg-transparent border-none cursor-pointer hover:text-gray-700 transition-colors"
                    >
                      Skip for now
                    </button>
                  </>
                )}
                {isEditing && (
                  <>
                    <button
                      onClick={handleSave}
                      className="px-3.5 py-1.5 text-xs font-medium text-white bg-[#212327] rounded-lg cursor-pointer hover:bg-gray-700 transition-colors border-none"
                    >
                      Save guardrails
                    </button>
                    <button
                      onClick={handleUseAISuggestions}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#3B6FD4] bg-transparent border-none cursor-pointer hover:text-[#2A56B0] transition-colors"
                    >
                      <Sparkles className="w-3 h-3" />
                      Use AI suggestions
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-3 py-1.5 text-xs font-medium text-gray-500 bg-transparent border-none cursor-pointer hover:text-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>

              {/* AI suggestions preview */}
              {isEditing && draft.source !== 'ai-suggested' && (
                <AISuggestionsPreview blueprint={blueprint} onAccept={(suggestions) => {
                  setDraft({ ...suggestions, source: 'ai-suggested' });
                }} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AISuggestionsPreview({
  blueprint,
  onAccept,
}: {
  blueprint?: Blueprint;
  onAccept: (suggestions: Partial<PerformanceGuardrails>) => void;
}) {
  const suggestions = generateAISuggestions(blueprint);
  const hasSuggestions = suggestions.targetCpa || suggestions.targetRoas || suggestions.targetConversions;

  if (!hasSuggestions) return null;

  return (
    <div className="border border-[#D4DFFF] bg-[#FAFBFF] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2.5">
        <Sparkles className="w-3.5 h-3.5 text-[#3B6FD4]" />
        <span className="text-xs font-semibold text-[#3B6FD4]">AI-suggested targets</span>
      </div>
      <p className="text-[11px] text-[#636A77] mb-3 m-0">
        Based on your campaign plan and expected outcomes, we recommend:
      </p>
      <div className="flex flex-wrap gap-3 mb-3">
        {suggestions.targetCpa && (
          <div className="text-xs"><span className="text-[#878F9E]">Target CPA:</span> <span className="font-semibold text-[#212327]">${suggestions.targetCpa}</span></div>
        )}
        {suggestions.targetRoas && (
          <div className="text-xs"><span className="text-[#878F9E]">Target ROAS:</span> <span className="font-semibold text-[#212327]">{suggestions.targetRoas}x</span></div>
        )}
        {suggestions.targetConversions && (
          <div className="text-xs"><span className="text-[#878F9E]">Target Conversions:</span> <span className="font-semibold text-[#212327]">{suggestions.targetConversions.toLocaleString()}</span></div>
        )}
      </div>
      <button
        onClick={() => onAccept(suggestions)}
        className="px-3 py-1.5 text-xs font-medium text-[#3B6FD4] bg-white border border-[#D4DFFF] rounded-lg cursor-pointer hover:bg-[#F0F4FF] transition-colors"
      >
        Apply suggestions
      </button>
    </div>
  );
}
