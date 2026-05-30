import { useState, useEffect } from 'react'
import { AppData, DEFAULT_APP_DATA } from './types'

function loadFromStorage(key: string): AppData {
  if (typeof window === 'undefined') return DEFAULT_APP_DATA
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return DEFAULT_APP_DATA
    return { ...DEFAULT_APP_DATA, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_APP_DATA
  }
}

export function useAppData(storageKey = 'app-store-preview-data') {
  const [appData, setAppData] = useState<AppData>(DEFAULT_APP_DATA)

  useEffect(() => {
    setAppData(loadFromStorage(storageKey))
  }, [storageKey])

  useEffect(() => {
    const { screenshots, iconDataUrl, ...persistable } = appData
    void screenshots; void iconDataUrl
    try {
      localStorage.setItem(storageKey, JSON.stringify(persistable))
    } catch {
      // quota exceeded
    }
  }, [appData, storageKey])

  function setField<K extends keyof AppData>(key: K, value: AppData[K]) {
    setAppData(prev => ({ ...prev, [key]: value }))
  }

  function clearData() {
    setAppData(DEFAULT_APP_DATA)
    localStorage.removeItem(storageKey)
  }

  return { appData, setField, clearData }
}
