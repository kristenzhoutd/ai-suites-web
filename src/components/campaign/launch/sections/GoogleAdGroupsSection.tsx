/**
 * Google Ads ad groups section — name, CPC bid, keywords with match types.
 */

import { useState } from 'react';
import { Target, Plus, X } from 'lucide-react';
import {
  GOOGLE_KEYWORD_MATCH_TYPES,
  inputClass,
  selectClass,
  selectStyle,
  labelClass,
  type GoogleLaunchConfig,
  type GoogleAdGroup,
  type GoogleKeyword,
} from '../../../../pages/campaignLaunch/constants';

interface Props {
  config: GoogleLaunchConfig;
  onAddAdGroup: () => void;
  onUpdateAdGroup: (localId: string, patch: Partial<GoogleAdGroup>) => void;
  onRemoveAdGroup: (localId: string) => void;
}

export default function GoogleAdGroupsSection({ config, onAddAdGroup, onUpdateAdGroup, onRemoveAdGroup }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Ad Groups</h2>
        <button
          onClick={onAddAdGroup}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-black/60 bg-transparent rounded-lg border border-black/15 hover:bg-black/5 hover:text-black transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Ad Group
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {config.adGroups.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center min-h-[60vh]">
            <div className="w-16 h-16 rounded-full bg-black/[0.06] flex items-center justify-center mb-3">
              <Target className="w-7 h-7 text-black/25" strokeWidth={1.5} />
            </div>
            <p className="text-sm text-black/40 mb-3">No ad groups yet</p>
            <button
              onClick={onAddAdGroup}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-black/60 bg-transparent rounded-lg border border-black/15 hover:bg-black/5 hover:text-black transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Ad Group
            </button>
          </div>
        )}
        {config.adGroups.map((adGroup, index) => (
          <AdGroupCard
            key={adGroup.localId}
            adGroup={adGroup}
            index={index}
            onUpdate={(patch) => onUpdateAdGroup(adGroup.localId, patch)}
            onRemove={() => onRemoveAdGroup(adGroup.localId)}
            canRemove={config.adGroups.length > 1}
          />
        ))}
      </div>
    </div>
  );
}

function AdGroupCard({ adGroup, index, onUpdate, onRemove, canRemove }: {
  adGroup: GoogleAdGroup;
  index: number;
  onUpdate: (patch: Partial<GoogleAdGroup>) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const [newKeyword, setNewKeyword] = useState('');
  const [newMatchType, setNewMatchType] = useState<GoogleKeyword['matchType']>('BROAD');

  const addKeyword = () => {
    if (!newKeyword.trim()) return;
    onUpdate({
      keywords: [...adGroup.keywords, { text: newKeyword.trim(), matchType: newMatchType }],
    });
    setNewKeyword('');
  };

  const removeKeyword = (idx: number) => {
    onUpdate({ keywords: adGroup.keywords.filter((_, i) => i !== idx) });
  };

  const bidDollars = (adGroup.cpcBidMicros / 1_000_000).toFixed(2);

  return (
    <div className="bg-white rounded-xl shadow-sm px-6 py-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-black/5 flex items-center justify-center text-[10px] font-semibold text-black/50 flex-shrink-0">{index + 1}</span>
          <span className="text-xs font-medium text-gray-400 uppercase">{adGroup.name || 'Untitled Ad Group'}</span>
        </div>
        {canRemove && (
          <button onClick={onRemove} className="text-xs text-gray-400 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer">
            Remove
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className={labelClass}>Ad Group Name</label>
          <input
            type="text"
            value={adGroup.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Default CPC Bid ($)</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={bidDollars}
            onChange={(e) => onUpdate({ cpcBidMicros: Math.round(parseFloat(e.target.value || '0') * 1_000_000) })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select
            value={adGroup.status}
            onChange={(e) => onUpdate({ status: e.target.value })}
            className={selectClass}
            style={selectStyle}
          >
            <option value="PAUSED">Paused</option>
            <option value="ENABLED">Enabled</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className={labelClass}>Keywords</label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {adGroup.keywords.map((kw, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-black/5 text-xs text-gray-700">
                <span className="text-[10px] text-gray-400 font-mono">{kw.matchType === 'EXACT' ? `[${kw.text}]` : kw.matchType === 'PHRASE' ? `"${kw.text}"` : kw.text}</span>
                <button onClick={() => removeKeyword(i)} className="text-gray-400 hover:text-red-500 bg-transparent border-none cursor-pointer p-0">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
              placeholder="Add keyword..."
              className={`flex-1 ${inputClass}`}
            />
            <select
              value={newMatchType}
              onChange={(e) => setNewMatchType(e.target.value as GoogleKeyword['matchType'])}
              className={`w-28 ${selectClass}`}
              style={selectStyle}
            >
              {GOOGLE_KEYWORD_MATCH_TYPES.map((mt) => (
                <option key={mt.value} value={mt.value}>{mt.label}</option>
              ))}
            </select>
            <button
              onClick={addKeyword}
              disabled={!newKeyword.trim()}
              className="px-3 py-2 text-xs font-medium text-white bg-black rounded-lg hover:bg-gray-800 disabled:opacity-30 transition-colors cursor-pointer border-none"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
