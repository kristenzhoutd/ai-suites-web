/**
 * Google Ads assets section — images, logos, headlines, and descriptions for Display campaigns.
 * Follows the same upload pattern as Meta's CreativesSection.
 */

import { ImageIcon, Plus, X, Upload } from 'lucide-react';
import {
  inputClass,
  labelClass,
  type GoogleLaunchConfig,
  type GoogleAsset,
} from '../../../../pages/campaignLaunch/constants';

interface Props {
  config: GoogleLaunchConfig;
  onAddAsset: (type: 'image' | 'logo') => void;
  onUpdateAsset: (localId: string, patch: Partial<GoogleAsset>) => void;
  onRemoveAsset: (localId: string) => void;
  onSelectFile: (localId: string) => void;
}

export default function GoogleAssetsSection({ config, onAddAsset, onUpdateAsset, onRemoveAsset, onSelectFile }: Props) {
  const images = config.assets.filter((a) => a.type === 'image');
  const logos = config.assets.filter((a) => a.type === 'logo');

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Assets</h2>
        <div className="flex gap-2">
          <button
            onClick={() => onAddAsset('image')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-black/60 bg-transparent rounded-lg border border-black/15 hover:bg-black/5 hover:text-black transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Image
          </button>
          <button
            onClick={() => onAddAsset('logo')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-black/60 bg-transparent rounded-lg border border-black/15 hover:bg-black/5 hover:text-black transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Logo
          </button>
        </div>
      </div>

      {config.assets.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center min-h-[60vh]">
          <div className="w-16 h-16 rounded-full bg-black/[0.06] flex items-center justify-center mb-3">
            <ImageIcon className="w-7 h-7 text-black/25" strokeWidth={1.5} />
          </div>
          <p className="text-sm text-black/40 mb-1">No assets yet</p>
          <p className="text-xs text-black/30 mb-4">Add images and logos for your Display & Performance Max campaigns</p>
          <div className="flex gap-2">
            <button
              onClick={() => onAddAsset('image')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-black/60 bg-transparent rounded-lg border border-black/15 hover:bg-black/5 hover:text-black transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Image
            </button>
            <button
              onClick={() => onAddAsset('logo')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-black/60 bg-transparent rounded-lg border border-black/15 hover:bg-black/5 hover:text-black transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Logo
            </button>
          </div>
        </div>
      )}

      {/* Marketing Images */}
      {images.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Marketing Images ({images.length})
            <span className="font-normal text-gray-400 ml-1">Recommended: 1200×628px</span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {images.map((asset, index) => (
              <AssetCard
                key={asset.localId}
                asset={asset}
                index={index}
                onUpdate={(patch) => onUpdateAsset(asset.localId, patch)}
                onRemove={() => onRemoveAsset(asset.localId)}
                onSelectFile={() => onSelectFile(asset.localId)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Logos */}
      {logos.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Logos ({logos.length})
            <span className="font-normal text-gray-400 ml-1">Recommended: 1200×1200px</span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {logos.map((asset, index) => (
              <AssetCard
                key={asset.localId}
                asset={asset}
                index={index}
                onUpdate={(patch) => onUpdateAsset(asset.localId, patch)}
                onRemove={() => onRemoveAsset(asset.localId)}
                onSelectFile={() => onSelectFile(asset.localId)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AssetCard({ asset, index, onUpdate, onRemove, onSelectFile }: {
  asset: GoogleAsset;
  index: number;
  onUpdate: (patch: Partial<GoogleAsset>) => void;
  onRemove: () => void;
  onSelectFile: () => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-black/5 flex items-center justify-center text-[10px] font-semibold text-black/50 flex-shrink-0">{index + 1}</span>
          <span className="text-[10px] font-semibold text-gray-400 uppercase">{asset.type}</span>
        </div>
        <button onClick={onRemove} className="text-gray-300 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer p-1">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Image preview / upload */}
      {asset.file ? (
        <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-lg mb-3">
          {asset.file.previewUrl ? (
            <img
              src={asset.file.previewUrl}
              alt="Preview"
              className="w-16 h-16 object-cover rounded-lg border border-gray-200"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center flex-shrink-0">
              <ImageIcon className="w-6 h-6 text-gray-300" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-900 truncate">{asset.file.fileName}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">
              {(asset.file.fileSize / 1024).toFixed(1)} KB
            </div>
          </div>
          <button
            onClick={() => onUpdate({ file: undefined })}
            className="text-gray-300 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          onClick={onSelectFile}
          className="w-full flex items-center justify-center gap-2 py-6 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:text-blue-500 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer bg-transparent mb-3"
        >
          <Upload className="w-4 h-4" />
          <span className="text-[11px] font-medium">Upload {asset.type === 'logo' ? 'Logo' : 'Image'}</span>
        </button>
      )}

      {/* Asset name */}
      <div>
        <label className={labelClass}>Name</label>
        <input
          type="text"
          value={asset.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder={asset.type === 'logo' ? 'Brand Logo' : 'Marketing Image'}
          className={inputClass}
        />
      </div>
    </div>
  );
}
