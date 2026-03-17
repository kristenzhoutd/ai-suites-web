/**
 * Google Ads campaign settings section — name, campaign type, budget, bidding strategy, status.
 */

import {
  GOOGLE_CAMPAIGN_TYPES,
  GOOGLE_BIDDING_STRATEGIES,
  inputClass,
  selectClass,
  selectStyle,
  labelClass,
  type GoogleLaunchConfig,
} from '../../../../pages/campaignLaunch/constants';

interface Props {
  config: GoogleLaunchConfig;
  onUpdate: (patch: Partial<GoogleLaunchConfig['campaign']>) => void;
}

export default function GoogleCampaignSettingsSection({ config, onUpdate }: Props) {
  const budgetDollars = (config.campaign.dailyBudgetMicros / 1_000_000).toFixed(2);

  return (
    <section className="bg-white rounded-xl shadow-sm overflow-hidden w-full">
      <div className="px-6 py-4 border-b border-[#E8ECF3]">
        <h2 className="text-sm font-semibold text-gray-900 m-0 uppercase tracking-wide">Campaign</h2>
      </div>
      <div className="px-6 py-5 grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className={labelClass}>Campaign Name</label>
          <input
            type="text"
            value={config.campaign.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Campaign Type</label>
          <select
            value={config.campaign.campaignType}
            onChange={(e) => onUpdate({ campaignType: e.target.value })}
            className={selectClass}
            style={selectStyle}
          >
            {GOOGLE_CAMPAIGN_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select
            value={config.campaign.status}
            onChange={(e) => onUpdate({ status: e.target.value })}
            className={selectClass}
            style={selectStyle}
          >
            <option value="PAUSED">Paused</option>
            <option value="ENABLED">Enabled</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Daily Budget ($)</label>
          <input
            type="number"
            min="1"
            step="0.01"
            value={budgetDollars}
            onChange={(e) => onUpdate({ dailyBudgetMicros: Math.round(parseFloat(e.target.value || '0') * 1_000_000) })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Bidding Strategy</label>
          <select
            value={config.campaign.biddingStrategy}
            onChange={(e) => onUpdate({ biddingStrategy: e.target.value })}
            className={selectClass}
            style={selectStyle}
          >
            {GOOGLE_BIDDING_STRATEGIES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        {config.campaign.biddingStrategy === 'TARGET_CPA' && (
          <div>
            <label className={labelClass}>Target CPA ($)</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={((config.campaign.targetCpaMicros || 0) / 1_000_000).toFixed(2)}
              onChange={(e) => onUpdate({ targetCpaMicros: Math.round(parseFloat(e.target.value || '0') * 1_000_000) })}
              className={inputClass}
            />
          </div>
        )}
        {config.campaign.biddingStrategy === 'TARGET_ROAS' && (
          <div>
            <label className={labelClass}>Target ROAS (%)</label>
            <input
              type="number"
              min="0"
              step="1"
              value={((config.campaign.targetRoas || 0) * 100).toFixed(0)}
              onChange={(e) => onUpdate({ targetRoas: parseFloat(e.target.value || '0') / 100 })}
              className={inputClass}
            />
          </div>
        )}
        {config.campaign.status === 'ENABLED' && (
          <div className="col-span-2 flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
              <circle cx="8" cy="8" r="7" stroke="#D97706" strokeWidth="1.5"/>
              <path d="M8 5V8.5M8 11H8.01" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="text-xs text-amber-800">This campaign will start spending immediately once created.</span>
          </div>
        )}
      </div>
    </section>
  );
}
