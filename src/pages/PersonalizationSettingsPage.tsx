import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../stores/appStore';
import IntegrationCard from '../components/settings/IntegrationCard';

type AemState = 'disconnected' | 'configuring' | 'connecting' | 'connected' | 'error';

export default function PersonalizationSettingsPage() {
  const { organizationId } = useAppStore();

  // AEM connection state
  const [aemState, setAemState] = useState<AemState>('disconnected');
  const [aemHost, setAemHost] = useState('');
  const [aemError, setAemError] = useState('');

  // AEM config form
  const [aemConfig, setAemConfig] = useState({
    host: '',
    clientId: '',
    clientSecret: '',
    imsOrgId: '',
    deliveryBaseUrl: '',
    authMethod: 'token' as 'oauth' | 's2s' | 'token',
    apiVersion: 'legacy' as 'legacy' | 'openapi',
    scopes: '',
    accessToken: '',
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [aemSaved, setAemSaved] = useState(false);

  // Check AEM status and load saved config on mount
  useEffect(() => {
    window.aiSuites?.aem?.status().then((res) => {
      if (res.success && res.data?.connected) {
        setAemState('connected');
        setAemHost(res.data.host || '');
      }
    });
    window.aiSuites?.settings?.get().then((settings: any) => {
      const saved = settings.aemConfig;
      if (saved) {
        setAemConfig((prev) => ({
          ...prev,
          host: saved.host || '',
          clientId: saved.clientId || '',
          clientSecret: saved.clientSecret || '',
          imsOrgId: saved.imsOrgId || '',
          deliveryBaseUrl: saved.deliveryBaseUrl || '',
          authMethod: saved.authMethod || 'token',
          apiVersion: saved.apiVersion || 'legacy',
          scopes: saved.scopes || '',
          accessToken: saved.accessToken || '',
        }));
      }
    });
  }, []);

  const handleAemSave = useCallback(async () => {
    await window.aiSuites?.settings?.set({ aemConfig });
    setAemSaved(true);
    setTimeout(() => setAemSaved(false), 2000);
  }, [aemConfig]);

  const handleAemConnect = useCallback(async () => {
    if (!aemConfig.host) {
      setAemError('AEM Host URL is required.');
      return;
    }
    if (!aemConfig.host.startsWith('https://')) {
      setAemError('AEM Host URL must use HTTPS.');
      return;
    }
    if (aemConfig.authMethod === 'token') {
      if (!aemConfig.accessToken) {
        setAemError('Access Token is required.');
        return;
      }
    } else {
      if (!aemConfig.clientId) {
        setAemError('Client ID is required.');
        return;
      }
      if (aemConfig.authMethod === 's2s' && !aemConfig.clientSecret) {
        setAemError('Client Secret is required for Server-to-Server auth.');
        return;
      }
    }

    setAemState('connecting');
    setAemError('');

    const result = await window.aiSuites?.aem?.connect(aemConfig);
    if (result.success) {
      setAemState('connected');
      setAemHost(aemConfig.host);
    } else {
      setAemState('error');
      setAemError(result.error || 'Connection failed');
    }
  }, [aemConfig]);

  const handleAemDisconnect = useCallback(async () => {
    await window.aiSuites?.aem?.disconnect();
    setAemState('disconnected');
    setAemHost('');
  }, []);

  const snippetCode = `<!-- Web Personalization Snippet -->
<script>
  (function(w, d, s, o) {
    w['WPT'] = o;
    w[o] = w[o] || function() { (w[o].q = w[o].q || []).push(arguments) };
    var js = d.createElement(s);
    js.src = 'https://cdn.yourapp.com/snippet.js';
    js.async = true;
    js.setAttribute('data-org-id', '${organizationId}');
    d.head.appendChild(js);
  })(window, document, 'script', 'wpt');
</script>`;

  return (
    <div className="h-full overflow-hidden flex">
      <div className="flex-1 flex flex-col overflow-y-auto px-6 py-4 space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
          <p className="text-xs text-gray-400 mt-0.5">Configure your personalization suite settings</p>
        </div>

        {/* Installation Snippet */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Installation snippet</h3>
          <p className="text-xs text-gray-400 mb-4">
            Add this code snippet to your website&apos;s &lt;head&gt; tag to enable personalization.
          </p>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-100 font-mono whitespace-pre">{snippetCode}</pre>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(snippetCode)}
            className="mt-3 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-black/60 bg-transparent rounded-lg border border-black/15 hover:bg-black/5 hover:text-black transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy to clipboard
          </button>
        </div>

        {/* Integrations */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Integrations</h3>
          <p className="text-xs text-gray-400 mb-4">
            Connect external services to enhance personalization.
          </p>

          <div className="grid grid-cols-3 gap-4">
            {/* Adobe AEM */}
            <IntegrationCard
              name="Adobe Experience Manager"
              description="Digital asset management for brand-approved content."
              icon={
                <img src="/adobe-icon.png" alt="Adobe" className="w-6 h-6" />
              }
              connected={aemState === 'connected'}
              onConnect={() => setAemState('configuring')}
              onDisconnect={handleAemDisconnect}
              connecting={aemState === 'connecting'}
            >
              {/* Connected info */}
              {aemState === 'connected' && aemHost && (
                <p className="text-xs text-gray-400 font-mono">{aemHost}</p>
              )}

              {/* Connecting state */}
              {aemState === 'connecting' && (
                <div className="flex items-center gap-3">
                  {aemConfig.authMethod === 'oauth' ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span className="text-xs text-gray-500">Waiting for Adobe sign-in...</span>
                      <button
                        onClick={() => { setAemState('configuring'); setAemError(''); }}
                        className="text-xs text-red-500 hover:text-red-600 ml-auto bg-transparent border-none cursor-pointer"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-gray-500">Connecting...</span>
                  )}
                </div>
              )}

              {/* Config form */}
              {(aemState === 'configuring' || aemState === 'error') && (
                <div className="space-y-2">
                  {/* Auth Method Toggle */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600 w-24 shrink-0">Auth Method</label>
                    <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                      {(['token', 'oauth', 's2s'] as const).map((method) => (
                        <button
                          key={method}
                          onClick={() => setAemConfig({ ...aemConfig, authMethod: method })}
                          className={`px-3 py-1.5 text-xs font-medium transition-colors border-none cursor-pointer ${
                            aemConfig.authMethod === method
                              ? 'bg-black text-white'
                              : 'bg-white text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {method === 'token' ? 'Access Token' : method === 'oauth' ? 'OAuth Web App' : 'OAuth Server-to-Server'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    type="url"
                    placeholder="AEM Host URL (https://author-p...-e....adobeaemcloud.com)"
                    value={aemConfig.host}
                    onChange={(e) => setAemConfig({ ...aemConfig, host: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400"
                  />

                  {aemConfig.authMethod === 'token' && (
                    <>
                      <input
                        type="password"
                        placeholder="Access Token"
                        value={aemConfig.accessToken}
                        onChange={(e) => setAemConfig({ ...aemConfig, accessToken: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400"
                      />
                      <p className="text-[11px] text-gray-400">
                        Paste a Bearer token from Adobe Developer Console. Token refresh is not supported — reconnect when expired.
                      </p>
                    </>
                  )}

                  {aemConfig.authMethod !== 'token' && (
                    <>
                      <input
                        type="text"
                        placeholder="Client ID (API Key)"
                        value={aemConfig.clientId}
                        onChange={(e) => setAemConfig({ ...aemConfig, clientId: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400"
                      />
                      <input
                        type="password"
                        placeholder={aemConfig.authMethod === 'oauth' ? 'Client Secret (optional for public clients)' : 'Client Secret'}
                        value={aemConfig.clientSecret}
                        onChange={(e) => setAemConfig({ ...aemConfig, clientSecret: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400"
                      />
                      <input
                        type="text"
                        placeholder={aemConfig.authMethod === 'oauth' ? 'Scopes (default: openid,AdobeID)' : 'Scopes (optional, comma-separated)'}
                        value={aemConfig.scopes}
                        onChange={(e) => setAemConfig({ ...aemConfig, scopes: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400"
                      />
                      {aemConfig.authMethod === 'oauth' && (
                        <p className="text-[11px] text-gray-400">
                          Ensure <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-600">https://localhost:3000/oauth/callback</code> is registered as a redirect URI.
                        </p>
                      )}
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 bg-transparent border-none cursor-pointer p-0"
                  >
                    <svg className={`w-3 h-3 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {showAdvanced ? 'Hide' : 'Show'} advanced options
                  </button>

                  {showAdvanced && (
                    <div className="space-y-2 pl-4 border-l-2 border-gray-100">
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 w-24 shrink-0">API Version</label>
                        <select
                          value={aemConfig.apiVersion}
                          onChange={(e) => setAemConfig({ ...aemConfig, apiVersion: e.target.value as 'legacy' | 'openapi' })}
                          className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 bg-white"
                        >
                          <option value="legacy">Legacy (all AEM versions)</option>
                          <option value="openapi">OpenAPI (AEMaaCS 2024.10+)</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        placeholder="IMS Org ID (optional, e.g., ABC123@AdobeOrg)"
                        value={aemConfig.imsOrgId}
                        onChange={(e) => setAemConfig({ ...aemConfig, imsOrgId: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400"
                      />
                      <input
                        type="url"
                        placeholder="Delivery Base URL (optional, for public asset URLs)"
                        value={aemConfig.deliveryBaseUrl}
                        onChange={(e) => setAemConfig({ ...aemConfig, deliveryBaseUrl: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400"
                      />
                    </div>
                  )}

                  {aemError && (
                    <p className="text-xs text-red-500">{aemError}</p>
                  )}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleAemConnect}
                      className="px-3 py-1.5 bg-black text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors border-none cursor-pointer"
                    >
                      {aemConfig.authMethod === 'oauth' ? 'Sign in with Adobe' : 'Connect'}
                    </button>
                    <button
                      onClick={handleAemSave}
                      className="px-3 py-1.5 border border-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors bg-transparent cursor-pointer"
                    >
                      {aemSaved ? 'Saved' : 'Save Settings'}
                    </button>
                    <button
                      onClick={() => { setAemState('disconnected'); setAemError(''); setShowAdvanced(false); }}
                      className="px-3 py-1.5 text-gray-500 text-xs font-medium rounded-lg hover:bg-gray-100 transition-colors bg-transparent border-none cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </IntegrationCard>

            {/* Bynder */}
            <IntegrationCard
              name="Bynder"
              description="Brand asset management and distribution platform."
              icon={
                <img src="/bynder-icon.svg" alt="Bynder" className="w-6 h-6" />
              }
              comingSoon
            />
          </div>
        </div>
      </div>
    </div>
  );
}
