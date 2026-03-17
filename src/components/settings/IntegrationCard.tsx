interface IntegrationCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  iconBg?: string;
  connected?: boolean;
  comingSoon?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  connecting?: boolean;
  disconnecting?: boolean;
  children?: React.ReactNode;
}

export default function IntegrationCard({
  name,
  description,
  icon,
  iconBg,
  connected,
  comingSoon,
  onConnect,
  onDisconnect,
  connecting,
  disconnecting,
  children,
}: IntegrationCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${iconBg || 'bg-black/[0.04]'}`}>
        {icon}
      </div>
      <h4 className="text-sm font-semibold text-gray-900">{name}</h4>
      <p className="text-xs text-gray-400 mt-1 flex-1">{description}</p>
      {children && <div className="mt-3">{children}</div>}
      <div className="flex items-center mt-4 pt-3 border-t border-gray-100">
        {comingSoon ? (
          <span className="text-xs text-black/30 font-medium">Coming Soon</span>
        ) : connected ? (
          <div className="flex items-center justify-between w-full">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Connected
            </span>
            <button
              onClick={onDisconnect}
              disabled={disconnecting}
              className="px-3 py-1 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors bg-transparent cursor-pointer disabled:opacity-50"
            >
              {disconnecting ? 'Disconnecting...' : 'Disconnect'}
            </button>
          </div>
        ) : (
          <button
            onClick={onConnect}
            disabled={connecting}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors bg-transparent border-none cursor-pointer disabled:opacity-50 p-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            {connecting ? 'Connecting...' : 'Connect'}
          </button>
        )}
      </div>
    </div>
  );
}
