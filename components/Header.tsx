'use client'
import { Eye } from 'lucide-react'
import { StoreVisibility, PreviewMode } from '@/lib/types'

interface HeaderProps {
  visibility: StoreVisibility
  onToggle: (store: keyof StoreVisibility) => void
  darkMode: boolean
  onToggleDark: () => void
  previewMode: PreviewMode
  onPreviewModeChange: (mode: PreviewMode) => void
  overlayOpacity: number
  onOverlayChange: (v: number) => void
}

export function Header({
  visibility, onToggle, darkMode, onToggleDark,
  previewMode, onPreviewModeChange,
  overlayOpacity, onOverlayChange,
}: HeaderProps) {
  return (
    <header className="h-12 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-between px-4 flex-shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-900 dark:text-white">Store Preview</span>
        <span className="text-xs text-gray-400">Tool</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Store toggles */}
        <button
          onClick={() => onToggle('googlePlay')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            visibility.googlePlay
              ? 'bg-[#01875f] text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
          }`}
        >
          Google Play
        </button>
        <button
          onClick={() => onToggle('appStore')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            visibility.appStore
              ? 'bg-[#007AFF] text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
          }`}
        >
          App Store
        </button>

        <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

        {/* View mode toggle */}
        <div className="flex items-center rounded-full p-0.5 bg-gray-100 dark:bg-gray-800">
          <button
            onClick={() => onPreviewModeChange('detail')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              previewMode === 'detail'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Detail
          </button>
          <button
            onClick={() => onPreviewModeChange('search')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              previewMode === 'search'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Search
          </button>
        </div>

        <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

        {/* Overlay slider */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800" title="Reference overlay opacity">
          <Eye className={`w-3.5 h-3.5 ${overlayOpacity > 0 ? 'text-blue-600' : 'text-gray-400'}`} />
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(overlayOpacity * 100)}
            onChange={e => onOverlayChange(Number(e.target.value) / 100)}
            className="w-20 accent-blue-600"
          />
        </div>

        <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

        {/* Dark mode */}
        <button
          onClick={onToggleDark}
          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Toggle dark mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}
