/**
 * Google Ads section — Responsive Search Ads with multiple headlines and descriptions.
 */

import { Megaphone, Plus, X } from 'lucide-react';
import {
  inputClass,
  selectClass,
  selectStyle,
  labelClass,
  type GoogleLaunchConfig,
  type GoogleAd,
} from '../../../../pages/campaignLaunch/constants';

interface Props {
  config: GoogleLaunchConfig;
  onAddAd: () => void;
  onUpdateAd: (localId: string, patch: Partial<GoogleAd>) => void;
  onRemoveAd: (localId: string) => void;
}

export default function GoogleAdsSection({ config, onAddAd, onUpdateAd, onRemoveAd }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Ads</h2>
        <button
          onClick={onAddAd}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-black/60 bg-transparent rounded-lg border border-black/15 hover:bg-black/5 hover:text-black transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Ad
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {config.ads.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center min-h-[60vh]">
            <div className="w-16 h-16 rounded-full bg-black/[0.06] flex items-center justify-center mb-3">
              <Megaphone className="w-7 h-7 text-black/25" strokeWidth={1.5} />
            </div>
            <p className="text-sm text-black/40 mb-3">No ads yet</p>
            <button
              onClick={onAddAd}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-black/60 bg-transparent rounded-lg border border-black/15 hover:bg-black/5 hover:text-black transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Ad
            </button>
          </div>
        )}
        {config.ads.map((ad, index) => (
          <AdCard
            key={ad.localId}
            ad={ad}
            index={index}
            adGroups={config.adGroups}
            onUpdate={(patch) => onUpdateAd(ad.localId, patch)}
            onRemove={() => onRemoveAd(ad.localId)}
            canRemove={config.ads.length > 1}
          />
        ))}
      </div>
    </div>
  );
}

function AdCard({ ad, index, adGroups, onUpdate, onRemove, canRemove }: {
  ad: GoogleAd;
  index: number;
  adGroups: GoogleLaunchConfig['adGroups'];
  onUpdate: (patch: Partial<GoogleAd>) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const rsa = ad.responsiveSearchAd || { headlines: [''], descriptions: [''], finalUrls: [''] };

  const updateRsa = (patch: Partial<typeof rsa>) => {
    onUpdate({ responsiveSearchAd: { ...rsa, ...patch } });
  };

  const updateHeadline = (idx: number, value: string) => {
    const headlines = [...rsa.headlines];
    headlines[idx] = value;
    updateRsa({ headlines });
  };

  const addHeadline = () => {
    if (rsa.headlines.length >= 15) return;
    updateRsa({ headlines: [...rsa.headlines, ''] });
  };

  const removeHeadline = (idx: number) => {
    updateRsa({ headlines: rsa.headlines.filter((_, i) => i !== idx) });
  };

  const updateDescription = (idx: number, value: string) => {
    const descriptions = [...rsa.descriptions];
    descriptions[idx] = value;
    updateRsa({ descriptions });
  };

  const addDescription = () => {
    if (rsa.descriptions.length >= 4) return;
    updateRsa({ descriptions: [...rsa.descriptions, ''] });
  };

  const removeDescription = (idx: number) => {
    updateRsa({ descriptions: rsa.descriptions.filter((_, i) => i !== idx) });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm px-6 py-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-black/5 flex items-center justify-center text-[10px] font-semibold text-black/50 flex-shrink-0">{index + 1}</span>
          <span className="text-xs font-medium text-gray-400 uppercase">{ad.name || 'Untitled Ad'}</span>
        </div>
        {canRemove && (
          <button onClick={onRemove} className="text-xs text-gray-400 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer">
            Remove
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Ad Name</label>
          <input
            type="text"
            value={ad.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Ad Group</label>
          <select
            value={ad.adGroupLocalId}
            onChange={(e) => onUpdate({ adGroupLocalId: e.target.value })}
            className={selectClass}
            style={selectStyle}
          >
            <option value="">Select ad group...</option>
            {adGroups.map((ag) => (
              <option key={ag.localId} value={ag.localId}>{ag.name || ag.localId}</option>
            ))}
          </select>
        </div>

        {/* Headlines */}
        <div className="col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className={`${labelClass} mb-0`}>Headlines <span className="text-gray-300 font-normal">({rsa.headlines.length}/15, max 30 chars)</span></label>
            {rsa.headlines.length < 15 && (
              <button onClick={addHeadline} className="text-[11px] text-gray-500 hover:text-gray-700 bg-transparent border-none cursor-pointer p-0">+ Add</button>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            {rsa.headlines.map((h, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <input
                  type="text"
                  maxLength={30}
                  value={h}
                  onChange={(e) => updateHeadline(i, e.target.value)}
                  placeholder={`Headline ${i + 1}`}
                  className={`flex-1 ${inputClass}`}
                />
                {rsa.headlines.length > 1 && (
                  <button onClick={() => removeHeadline(i)} className="text-gray-300 hover:text-red-500 bg-transparent border-none cursor-pointer p-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Descriptions */}
        <div className="col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className={`${labelClass} mb-0`}>Descriptions <span className="text-gray-300 font-normal">({rsa.descriptions.length}/4, max 90 chars)</span></label>
            {rsa.descriptions.length < 4 && (
              <button onClick={addDescription} className="text-[11px] text-gray-500 hover:text-gray-700 bg-transparent border-none cursor-pointer p-0">+ Add</button>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            {rsa.descriptions.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <input
                  type="text"
                  maxLength={90}
                  value={d}
                  onChange={(e) => updateDescription(i, e.target.value)}
                  placeholder={`Description ${i + 1}`}
                  className={`flex-1 ${inputClass}`}
                />
                {rsa.descriptions.length > 1 && (
                  <button onClick={() => removeDescription(i)} className="text-gray-300 hover:text-red-500 bg-transparent border-none cursor-pointer p-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Final URL */}
        <div className="col-span-2">
          <label className={labelClass}>Final URL</label>
          <input
            type="url"
            value={rsa.finalUrls[0] || ''}
            onChange={(e) => updateRsa({ finalUrls: [e.target.value] })}
            placeholder="https://example.com/landing-page"
            className={inputClass}
          />
        </div>

        {/* Display paths */}
        <div>
          <label className={labelClass}>Display Path 1 <span className="text-gray-300 font-normal">(optional)</span></label>
          <input
            type="text"
            maxLength={15}
            value={rsa.path1 || ''}
            onChange={(e) => updateRsa({ path1: e.target.value })}
            placeholder="e.g. shoes"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Display Path 2 <span className="text-gray-300 font-normal">(optional)</span></label>
          <input
            type="text"
            maxLength={15}
            value={rsa.path2 || ''}
            onChange={(e) => updateRsa({ path2: e.target.value })}
            placeholder="e.g. sale"
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}
