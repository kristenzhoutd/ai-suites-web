/**
 * API Key Setup Modal — shown when API key is missing on first visit.
 * Lightweight modal for entering LLM proxy credentials.
 */

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Key, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ApiKeySetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_LLM_PROXY_URL = 'https://llm-proxy.us01.treasuredata.com';

export default function ApiKeySetupModal({ isOpen, onClose }: ApiKeySetupModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [llmProxyUrl, setLlmProxyUrl] = useState(DEFAULT_LLM_PROXY_URL);
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Load existing settings on open
  useEffect(() => {
    if (isOpen) {
      const loadSettings = async () => {
        try {
          const settings = await window.aiSuites?.settings?.get();
          if (settings?.llmProxyUrl) setLlmProxyUrl(settings.llmProxyUrl as string);
        } catch { /* ignore */ }
      };
      loadSettings();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!apiKey.trim()) return;
    setStatus('testing');
    setErrorMessage('');

    try {
      await window.aiSuites?.settings?.set({
        apiKey: apiKey.trim(),
        llmProxyUrl: llmProxyUrl || DEFAULT_LLM_PROXY_URL,
      });

      // Test connection
      const result = await window.aiSuites?.settings?.testConnection();
      if (result?.success) {
        setStatus('success');
        setTimeout(() => {
          onClose();
          setStatus('idle');
          setApiKey('');
        }, 1200);
      } else {
        setStatus('error');
        setErrorMessage(result?.error || 'Connection failed. Please check your API key.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage('Failed to save settings.');
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <Key className="w-4.5 h-4.5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900" style={{ fontFamily: "'Manrope', sans-serif" }}>
                Connect to Treasure AI
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Enter your API key to enable AI-powered experiences
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer flex-shrink-0"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 pt-2 space-y-4">
          {/* LLM Proxy URL */}
          <div>
            <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">LLM Proxy URL</label>
            <input
              type="text"
              value={llmProxyUrl}
              onChange={(e) => setLlmProxyUrl(e.target.value)}
              placeholder={DEFAULT_LLM_PROXY_URL}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* API Key */}
          <div>
            <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => { setApiKey(e.target.value); if (status !== 'testing') setStatus('idle'); }}
              placeholder="Enter your Treasure Data API key"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
            />
          </div>

          {/* Status */}
          {status === 'success' && (
            <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
              <CheckCircle className="w-4 h-4" />
              Connected successfully
            </div>
          )}
          {status === 'error' && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              {errorMessage}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end pt-2">
            {status === 'success' ? (
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                <CheckCircle className="w-4 h-4" />
                Connected
              </div>
            ) : (
              <button
                onClick={handleSave}
                disabled={!apiKey.trim() || status === 'testing'}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                  apiKey.trim() && status !== 'testing'
                    ? 'bg-gray-900 text-white hover:bg-gray-800 cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {status === 'testing' ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Testing...
                  </span>
                ) : (
                  'Connect'
                )}
              </button>
            )}
          </div>

          {/* Help text */}
          <p className="text-[10px] text-gray-400 text-center leading-relaxed">
            Your API key is stored locally in your browser and used to connect to the Treasure Data LLM proxy. You can update it anytime in Settings.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}

/** Check if API key is configured (localStorage or env) */
export function isApiKeyConfigured(): boolean {
  try {
    return !!localStorage.getItem('ai-suites-api-key');
  } catch {
    return false;
  }
}
