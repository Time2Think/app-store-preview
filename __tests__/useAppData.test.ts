import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAppData } from '../lib/useAppData'
import { DEFAULT_APP_DATA } from '../lib/types'

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
})()

beforeEach(() => {
  localStorageMock.clear()
  Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true })
})

describe('useAppData', () => {
  it('returns default data on first load', () => {
    const { result } = renderHook(() => useAppData())
    expect(result.current.appData.appName).toBe(DEFAULT_APP_DATA.appName)
  })

  it('updates field and persists to localStorage', async () => {
    const { result } = renderHook(() => useAppData())
    act(() => {
      result.current.setField('appName', 'MyApp')
    })
    expect(result.current.appData.appName).toBe('MyApp')
    const stored = JSON.parse(localStorageMock.getItem('app-store-preview-data') ?? '{}')
    expect(stored.appName).toBe('MyApp')
  })

  it('resets to default on clearData', () => {
    const { result } = renderHook(() => useAppData())
    act(() => { result.current.setField('appName', 'MyApp') })
    act(() => { result.current.clearData() })
    expect(result.current.appData.appName).toBe(DEFAULT_APP_DATA.appName)
  })
})
