'use client'
import { useCallback } from 'react'
import { AppData } from '@/lib/types'
import { CharCounter } from './CharCounter'
import { ScreenshotUploader } from './ScreenshotUploader'

interface AppFormProps {
  data: AppData
  onChange: <K extends keyof AppData>(key: K, value: AppData[K]) => void
  onClear: () => void
  onDownloadGP: () => void
  onDownloadAS: () => void
}

export function AppForm({ data, onChange, onClear, onDownloadGP, onDownloadAS }: AppFormProps) {
  const handleIconUpload = useCallback((files: FileList | null) => {
    if (!files?.[0]) return
    const reader = new FileReader()
    reader.onload = e => {
      onChange('iconDataUrl', e.target?.result as string)
    }
    reader.readAsDataURL(files[0])
  }, [onChange])

  return (
    <aside className="w-80 min-w-[320px] h-full overflow-y-auto border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 flex flex-col gap-4">

      {/* App Name */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">App Name</label>
          <CharCounter current={data.appName.length} max={50} />
        </div>
        <input
          type="text"
          value={data.appName}
          maxLength={50}
          onChange={e => onChange('appName', e.target.value)}
          placeholder="Your App Name"
          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Subtitle */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Subtitle / Short Desc</label>
          <CharCounter current={data.subtitle.length} max={80} />
        </div>
        <input
          type="text"
          value={data.subtitle}
          maxLength={80}
          onChange={e => onChange('subtitle', e.target.value)}
          placeholder="App Subtitle"
          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Developer + Category */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Developer</label>
          <input
            type="text"
            value={data.developerName}
            maxLength={50}
            onChange={e => onChange('developerName', e.target.value)}
            placeholder="Developer Name"
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Category</label>
          <input
            type="text"
            value={data.category}
            maxLength={30}
            onChange={e => onChange('category', e.target.value)}
            placeholder="Utilities"
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Rating + Reviews */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Rating (0–5)</label>
          <input
            type="number"
            value={data.rating}
            min={0}
            max={5}
            step={0.1}
            onChange={e => onChange('rating', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Reviews</label>
          <input
            type="number"
            value={data.reviewCount}
            min={0}
            onChange={e => onChange('reviewCount', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Price */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Price (leave empty = Free)</label>
        <input
          type="text"
          value={data.price}
          onChange={e => onChange('price', e.target.value)}
          placeholder="0.99"
          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* In-App Purchases */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={data.hasInAppPurchases}
          onChange={e => onChange('hasInAppPurchases', e.target.checked)}
          className="rounded"
        />
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">In-App Purchases</span>
      </label>

      {/* Icon Upload */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-700 dark:text-gray-300">App Icon</label>
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 overflow-hidden flex items-center justify-center border border-gray-200 dark:border-gray-600">
            {data.iconDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.iconDataUrl} alt="App icon" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl text-gray-300">+</span>
            )}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">Click to upload icon</span>
          <input type="file" accept="image/*" className="sr-only" onChange={e => handleIconUpload(e.target.files)} />
        </label>
      </div>

      {/* Screenshots */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Screenshots</label>
        <ScreenshotUploader
          screenshots={data.screenshots}
          onChange={v => onChange('screenshots', v)}
        />
      </div>

      {/* Actions */}
      <div className="mt-auto pt-4 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onDownloadGP}
            className="px-3 py-2 text-xs font-medium bg-[#01875f] hover:bg-[#016b4d] text-white rounded-lg transition-colors"
          >
            ↓ Google Play
          </button>
          <button
            onClick={onDownloadAS}
            className="px-3 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            ↓ App Store
          </button>
        </div>
        <button
          onClick={onClear}
          className="w-full px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Clear Data
        </button>
      </div>
    </aside>
  )
}
