import { useState, useEffect } from 'react';
import IntegrationCard from '../components/settings/IntegrationCard';

interface PlatformStatus {
  platform: string;
  connected: boolean;
  accountName?: string;
  accountId?: string;
  lastSyncedAt?: string;
}

export default function PaidMediaSettingsPage() {
  const [accessToken, setAccessToken] = useState('');

  const [metaStatus, setMetaStatus] = useState<PlatformStatus | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTokenInput, setShowTokenInput] = useState(false);

  // Google Ads state
  const [googleStatus, setGoogleStatus] = useState<PlatformStatus | null>(null);
  const [googleConnecting, setGoogleConnecting] = useState(false);
  const [googleDisconnecting, setGoogleDisconnecting] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [showGoogleConfig, setShowGoogleConfig] = useState(false);
  const [googleConfig, setGoogleConfig] = useState({ clientId: '', clientSecret: '', developerToken: '', customerId: '' });

  useEffect(() => {
    const load = async () => {
      try {
        const settings = await window.aiSuites?.settings.get();
        if (settings) {
          const meta = (settings.platformConnections as any)?.meta;
          if (meta?.accessToken) setAccessToken(meta.accessToken);
        }

        const statusResult = await window.aiSuites?.platforms.status();
        if (statusResult?.success && statusResult.data) {
          const data = statusResult.data as any;
          if (data.meta) setMetaStatus(data.meta);
          if (data.google) setGoogleStatus(data.google);
        }

        // Load saved Google config
        if (settings) {
          const google = (settings.platformConnections as any)?.google;
          if (google) {
            setGoogleConfig({
              clientId: google.clientId || '',
              clientSecret: google.clientSecret || '',
              developerToken: google.developerToken || '',
              customerId: google.customerId || '',
            });
          }
        }
      } catch (err) {
        console.error('Failed to load platform settings:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleConnect = async () => {
    if (!accessToken.trim()) {
      setShowTokenInput(true);
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const result = await window.aiSuites?.platforms.connect('meta', { accessToken });

      if (result?.success && (result as any).connection) {
        setMetaStatus((result as any).connection);
        setShowTokenInput(false);
      } else {
        setError(result?.error || 'Failed to connect to Meta Ads.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    setError(null);

    try {
      const result = await window.aiSuites?.platforms.disconnect('meta');
      if (result?.success) {
        setMetaStatus({ platform: 'meta', connected: false });
        setAccessToken('');
      } else {
        setError(result?.error || 'Failed to disconnect.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleGoogleConnect = async () => {
    if (!googleConfig.clientId || !googleConfig.clientSecret || !googleConfig.developerToken) {
      setShowGoogleConfig(true);
      return;
    }

    setGoogleConnecting(true);
    setGoogleError(null);

    try {
      // Save config first so the main process can read it during OAuth
      await window.aiSuites?.settings.set({
        platformConnections: {
          google: {
            clientId: googleConfig.clientId,
            clientSecret: googleConfig.clientSecret,
            developerToken: googleConfig.developerToken,
            customerId: googleConfig.customerId,
            connected: false,
          },
        },
      } as any);

      const result = await window.aiSuites?.platforms.oauthLogin('google');
      if (result?.success && result.connection) {
        setGoogleStatus(result.connection);
        setShowGoogleConfig(false);
      } else {
        setGoogleError(result?.error || 'Failed to connect to Google Ads.');
      }
    } catch (err: any) {
      setGoogleError(err.message || 'An unexpected error occurred.');
    } finally {
      setGoogleConnecting(false);
    }
  };

  const handleGoogleDisconnect = async () => {
    setGoogleDisconnecting(true);
    setGoogleError(null);

    try {
      const result = await window.aiSuites?.platforms.disconnect('google');
      if (result?.success) {
        setGoogleStatus({ platform: 'google', connected: false });
      } else {
        setGoogleError(result?.error || 'Failed to disconnect.');
      }
    } catch (err: any) {
      setGoogleError(err.message || 'An unexpected error occurred.');
    } finally {
      setGoogleDisconnecting(false);
    }
  };

  return (
    <div className="h-full overflow-hidden flex">
      <div className="flex-1 flex flex-col overflow-y-auto px-4 pb-4 space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
          <p className="text-xs text-gray-400 mt-0.5">Configure your paid media integrations</p>
        </div>

        {/* Ad Platform Integrations */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Ad platform integrations</h3>
          <p className="text-xs text-gray-400 mb-4">Connect your ad platforms to manage campaigns directly.</p>

          <div className="grid grid-cols-3 gap-4">
            {/* Meta Ads */}
            <IntegrationCard
              name="Meta Ads"
              description="Manage Facebook & Instagram campaigns with full API access."
              icon={
                <img src="/meta-icon.webp" alt="Meta" className="w-6 h-6" />
              }
              connected={metaStatus?.connected}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              connecting={isConnecting}
              disconnecting={isDisconnecting}
            >
              {!isLoading && !metaStatus?.connected && showTokenInput && (
                <div className="space-y-2">
                  <input
                    type="password"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    placeholder="Paste access token"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all"
                  />
                  <button
                    onClick={handleConnect}
                    disabled={isConnecting || !accessToken.trim()}
                    className="px-3 py-1.5 bg-black text-white text-xs font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors cursor-pointer border-none"
                  >
                    {isConnecting ? 'Connecting...' : 'Connect'}
                  </button>
                </div>
              )}
              {metaStatus?.connected && (
                <div className="text-xs text-gray-400">
                  <span className="text-gray-600 font-medium">{metaStatus.accountName || 'Meta Ad Account'}</span>
                  {metaStatus.accountId && <span className="ml-2 font-mono">{metaStatus.accountId}</span>}
                </div>
              )}
              {error && (
                <div className="p-2 rounded-lg text-[11px] bg-red-50 text-red-700 border border-red-200">
                  {error}
                </div>
              )}
            </IntegrationCard>

            {/* LiveRamp */}
            <IntegrationCard
              name="LiveRamp"
              description="Audience enrichment and activation for cross-channel targeting."
              icon={
                <img src="/liveramp-icon.jpg" alt="LiveRamp" className="w-10 h-10 rounded-lg" />
              }
              iconBg="bg-transparent"
              connected
            >
              <div className="text-xs text-gray-400">
                <span className="text-gray-600 font-medium">Hilton Worldwide</span>
                <span className="ml-2 font-mono">lr-acct-hw-001</span>
              </div>
            </IntegrationCard>

            {/* Google Ads */}
            <IntegrationCard
              name="Google Ads"
              description="Search, Display & YouTube campaign management."
              icon={
                <img src="/google-ads-icon.png" alt="Google Ads" className="w-6 h-6" />
              }
              connected={googleStatus?.connected}
              onConnect={handleGoogleConnect}
              onDisconnect={handleGoogleDisconnect}
              connecting={googleConnecting}
              disconnecting={googleDisconnecting}
            >
              {!isLoading && !googleStatus?.connected && showGoogleConfig && (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={googleConfig.clientId}
                    onChange={(e) => setGoogleConfig({ ...googleConfig, clientId: e.target.value })}
                    placeholder="OAuth Client ID"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all"
                  />
                  <input
                    type="password"
                    value={googleConfig.clientSecret}
                    onChange={(e) => setGoogleConfig({ ...googleConfig, clientSecret: e.target.value })}
                    placeholder="OAuth Client Secret"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all"
                  />
                  <input
                    type="password"
                    value={googleConfig.developerToken}
                    onChange={(e) => setGoogleConfig({ ...googleConfig, developerToken: e.target.value })}
                    placeholder="Developer Token"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all"
                  />
                  <input
                    type="text"
                    value={googleConfig.customerId}
                    onChange={(e) => setGoogleConfig({ ...googleConfig, customerId: e.target.value })}
                    placeholder="Customer ID (e.g. 791-170-5464)"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all"
                  />
                  <button
                    onClick={handleGoogleConnect}
                    disabled={googleConnecting || !googleConfig.clientId.trim() || !googleConfig.clientSecret.trim() || !googleConfig.developerToken.trim()}
                    className="px-3 py-1.5 bg-black text-white text-xs font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors cursor-pointer border-none"
                  >
                    {googleConnecting ? 'Connecting...' : 'Sign in with Google'}
                  </button>
                </div>
              )}
              {googleStatus?.connected && (
                <div className="text-xs text-gray-400">
                  <span className="text-gray-600 font-medium">{googleStatus.accountName || 'Google Ads Account'}</span>
                  {googleStatus.accountId && <span className="ml-2 font-mono">{googleStatus.accountId}</span>}
                </div>
              )}
              {googleError && (
                <div className="p-2 rounded-lg text-[11px] bg-red-50 text-red-700 border border-red-200">
                  {googleError}
                </div>
              )}
            </IntegrationCard>

            {/* TikTok Ads */}
            <IntegrationCard
              name="TikTok Ads"
              description="TikTok campaign creation and performance management."
              icon={
                <img src="/tiktok-icon.webp" alt="TikTok" className="w-6 h-6" />
              }
              comingSoon
            />

            {/* LinkedIn Ads */}
            <IntegrationCard
              name="LinkedIn Ads"
              description="B2B advertising and professional audience targeting."
              icon={
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#0A66C2" />
                </svg>
              }
              comingSoon
            />
          </div>
        </div>

        {/* Digital Asset Management */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Digital asset management</h3>
          <p className="text-xs text-gray-400 mb-4">Connect your DAM platforms to browse and use brand-approved assets.</p>

          <div className="grid grid-cols-3 gap-4">
            {/* Adobe AEM */}
            <IntegrationCard
              name="Adobe Experience Manager"
              description="Enterprise digital asset management for brand-approved content."
              icon={
                <img src="/adobe-icon.png" alt="Adobe" className="w-6 h-6" />
              }
              connected
            >
              <div className="text-xs text-gray-400">
                <span className="text-gray-600 font-medium">Hilton Brand Assets</span>
              </div>
            </IntegrationCard>

            {/* Bynder */}
            <IntegrationCard
              name="Bynder"
              description="Brand asset management and distribution platform."
              icon={
                <img src="/bynder-icon.svg" alt="Bynder" className="w-6 h-6" />
              }
              connected
            >
              <div className="text-xs text-gray-400">
                <span className="text-gray-600 font-medium">Hilton Brand Portal</span>
              </div>
            </IntegrationCard>
          </div>
        </div>
      </div>
    </div>
  );
}
