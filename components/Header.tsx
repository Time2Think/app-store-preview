'use client'
import { StoreVisibility } from '@/lib/types'

interface HeaderProps {
  visibility: StoreVisibility
  onToggle: (store: keyof StoreVisibility) => void
  darkMode: boolean
  onToggleDark: () => void
}

export function Header({ visibility, onToggle, darkMode, onToggleDark }: HeaderProps) {
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

        {/* Dark mode */}
        <button
          onClick={onToggleDark}
          className="ml-2 w-8 h-8 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Toggle dark mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}
