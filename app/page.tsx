'use client'
import { useState } from 'react'
import { Header } from '@/components/Header'
import { AppForm } from '@/components/AppForm'
import { PhoneFrame } from '@/components/PhoneFrame'
import { GooglePlayPreview } from '@/components/GooglePlayPreview'
import { AppStorePreview } from '@/components/AppStorePreview'
import { ReferenceOverlay } from '@/components/ReferenceOverlay'
import { useAppData } from '@/lib/useAppData'
import { useDarkMode } from '@/lib/useDarkMode'
import { downloadPreview } from '@/lib/export'
import { StoreVisibility, PreviewMode } from '@/lib/types'

type DesignSlot = 'A' | 'B'

export default function Home() {
  const dataA = useAppData('app-data-a')
  const dataB = useAppData('app-data-b')
  const { dark, toggle: toggleDark } = useDarkMode()
  const [visibility, setVisibility] = useState<StoreVisibility>({ googlePlay: true, appStore: true })
  const [previewMode, setPreviewMode] = useState<PreviewMode>('search')
  const [activeSlot, setActiveSlot] = useState<DesignSlot>('A')
  const [compareOn, setCompareOn] = useState(false)
  const [overlayOpacity, setOverlayOpacity] = useState(0)

  const active = activeSlot === 'A' ? dataA : dataB

  function toggleStore(store: keyof StoreVisibility) {
    setVisibility(v => ({ ...v, [store]: !v[store] }))
  }

  function makeIconUpload(slot: DesignSlot) {
    return (dataUrl: string) => {
      const d = slot === 'A' ? dataA : dataB
      d.setField('iconDataUrl', dataUrl)
    }
  }

  function makeScreenshotUpload(slot: DesignSlot) {
    return (index: number, dataUrl: string) => {
      const d = slot === 'A' ? dataA : dataB
      const shots = [...(slot === 'A' ? dataA.appData.screenshots : dataB.appData.screenshots)]
      if (index >= shots.length) shots.push(dataUrl)
      else shots[index] = dataUrl
      d.setField('screenshots', shots)
    }
  }

  const slots: DesignSlot[] = compareOn ? ['A', 'B'] : [activeSlot]

  return (
    <div className="flex flex-col h-screen">
      <Header
        visibility={visibility}
        onToggle={toggleStore}
        darkMode={dark}
        onToggleDark={toggleDark}
        previewMode={previewMode}
        onPreviewModeChange={setPreviewMode}
        overlayOpacity={overlayOpacity}
        onOverlayChange={setOverlayOpacity}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left column: A/B bar + form */}
        <div className="flex flex-col w-80 min-w-[320px] h-full border-r border-gray-200 dark:border-gray-700">
          {/* A/B toggle */}
          <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
              {(['A', 'B'] as DesignSlot[]).map(slot => (
                <button
                  key={slot}
                  onClick={() => setActiveSlot(slot)}
                  className={`px-4 py-1.5 text-xs font-semibold transition-colors ${
                    activeSlot === slot
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  Design {slot}
                </button>
              ))}
            </div>

            {/* Compare toggle */}
            <label className="flex items-center gap-1.5 ml-auto cursor-pointer select-none">
              <button
                onClick={() => setCompareOn(v => !v)}
                className={`relative w-8 h-[18px] rounded-full transition-colors flex-shrink-0 ${compareOn ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                <div className={`absolute top-[3px] w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${compareOn ? 'translate-x-[18px]' : 'translate-x-[3px]'}`} />
              </button>
              <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">Compare</span>
            </label>
          </div>

          <AppForm
            data={active.appData}
            onChange={active.setField}
            onClear={active.clearData}
            onDownloadGP={() => downloadPreview(`gp-preview-${activeSlot}`, `googleplay-${activeSlot}.png`)}
            onDownloadAS={() => downloadPreview(`as-preview-${activeSlot}`, `appstore-${activeSlot}.png`)}
          />
        </div>

        {/* Preview area */}
        <main className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-950 p-6">
          <div className="flex gap-6 justify-center items-start min-h-full flex-wrap">
            {visibility.googlePlay && slots.map(slot => {
              const d = slot === 'A' ? dataA.appData : dataB.appData
              return (
                <div key={`gp-${slot}`} className="flex flex-col items-center gap-2">
                  {compareOn && (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                      Design {slot}
                    </span>
                  )}
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Google Play
                  </span>
                  <div id={`gp-preview-${slot}`}>
                    <PhoneFrame
                      type="android"
                      overlay={<ReferenceOverlay store="android" mode={previewMode} opacity={overlayOpacity} />}
                    >
                      <GooglePlayPreview
                        data={d}
                        dark={dark}
                        mode={previewMode}
                        onUploadIcon={makeIconUpload(slot)}
                        onUploadScreenshot={makeScreenshotUpload(slot)}
                      />
                    </PhoneFrame>
                  </div>
                </div>
              )
            })}

            {visibility.appStore && slots.map(slot => {
              const d = slot === 'A' ? dataA.appData : dataB.appData
              return (
                <div key={`as-${slot}`} className="flex flex-col items-center gap-2">
                  {compareOn && (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                      Design {slot}
                    </span>
                  )}
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    App Store
                  </span>
                  <div id={`as-preview-${slot}`}>
                    <PhoneFrame
                      type="ios"
                      overlay={<ReferenceOverlay store="ios" mode={previewMode} opacity={overlayOpacity} />}
                    >
                      <AppStorePreview
                        data={d}
                        dark={dark}
                        mode={previewMode}
                        onUploadIcon={makeIconUpload(slot)}
                        onUploadScreenshot={makeScreenshotUpload(slot)}
                      />
                    </PhoneFrame>
                  </div>
                </div>
              )
            })}

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
