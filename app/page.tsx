'use client'
import { useState } from 'react'
import { Header } from '@/components/Header'
import { AppForm } from '@/components/AppForm'
import { PhoneFrame } from '@/components/PhoneFrame'
import { GooglePlayPreview } from '@/components/GooglePlayPreview'
import { AppStorePreview } from '@/components/AppStorePreview'
import { useAppData } from '@/lib/useAppData'
import { useDarkMode } from '@/lib/useDarkMode'
import { downloadPreview } from '@/lib/export'
import { StoreVisibility, PreviewMode } from '@/lib/types'

export default function Home() {
  const { appData, setField, clearData } = useAppData()
  const { dark, toggle: toggleDark } = useDarkMode()
  const [visibility, setVisibility] = useState<StoreVisibility>({
    googlePlay: true,
    appStore: true,
  })
  const [previewMode, setPreviewMode] = useState<PreviewMode>('search')

  function toggleStore(store: keyof StoreVisibility) {
    setVisibility(v => ({ ...v, [store]: !v[store] }))
  }

  return (
    <div className="flex flex-col h-screen">
      <Header
        visibility={visibility}
        onToggle={toggleStore}
        darkMode={dark}
        onToggleDark={toggleDark}
        previewMode={previewMode}
        onPreviewModeChange={setPreviewMode}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <AppForm
          data={appData}
          onChange={setField}
          onClear={clearData}
          onDownloadGP={() => downloadPreview('gp-preview', 'googleplay-preview.png')}
          onDownloadAS={() => downloadPreview('as-preview', 'appstore-preview.png')}
        />

        {/* Right preview area */}
        <main className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-950 p-8">
          <div className="flex gap-12 justify-center items-start min-h-full">
            {visibility.googlePlay && (
              <div className="flex flex-col items-center gap-3">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Google Play
                </span>
                <div id="gp-preview">
                  <PhoneFrame type="android">
                    <GooglePlayPreview data={appData} dark={dark} mode={previewMode} />
                  </PhoneFrame>
                </div>
              </div>
            )}

            {visibility.appStore && (
              <div className="flex flex-col items-center gap-3">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  App Store
                </span>
                <div id="as-preview">
                  <PhoneFrame type="ios">
                    <AppStorePreview data={appData} dark={dark} mode={previewMode} />
                  </PhoneFrame>
                </div>
              </div>
            )}

            {!visibility.googlePlay && !visibility.appStore && (
              <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-600 text-sm">
                Enable a store preview using the toggles above
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
