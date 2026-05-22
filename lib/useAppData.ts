import { useState, useEffect } from 'react'
import { AppData, DEFAULT_APP_DATA } from './types'

const STORAGE_KEY = 'app-store-preview-data'

function loadFromStorage(): AppData {
  if (typeof window === 'undefined') return DEFAULT_APP_DATA
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_APP_DATA
    return { ...DEFAULT_APP_DATA, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_APP_DATA
  }
}

export function useAppData() {
  const [appData, setAppData] = useState<AppData>(DEFAULT_APP_DATA)

  useEffect(() => {
    setAppData(loadFromStorage())
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData))
  }, [appData])

  function setField<K extends keyof AppData>(key: K, value: AppData[K]) {
    setAppData(prev => ({ ...prev, [key]: value }))
  }

  function clearData() {
    setAppData(DEFAULT_APP_DATA)
    localStorage.removeItem(STORAGE_KEY)
  }

  return { appData, setField, clearData }
}
