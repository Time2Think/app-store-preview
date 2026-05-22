# App Store Preview Tool — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a browser-based tool that lets users fill in one form and instantly see how their app listing looks in both the Apple App Store and Google Play Market, with device frame mockups and PNG export.

**Architecture:** Pure client-side Next.js 15 App Router app. All state lives in React (useState), auto-synced to localStorage via a custom hook. No backend, no auth. Two independent preview panels (Android/GP and iPhone/AS) re-render on every keystroke.

**Tech Stack:** Next.js 15 + TypeScript + Tailwind CSS + @dnd-kit/sortable + html2canvas + Vitest + @testing-library/react

---

## File Map

```
app-store-preview/
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── app/
│   ├── layout.tsx              # Root layout, ThemeProvider wrapper
│   ├── page.tsx                # Main page — assembles all panels
│   └── globals.css             # Tailwind base + dark mode CSS vars
├── components/
│   ├── Header.tsx              # Logo + [GP] [AS] toggles + dark mode
│   ├── AppForm.tsx             # Left sidebar — all form inputs + actions
│   ├── CharCounter.tsx         # "23/30" badge, red when >80%
│   ├── ScreenshotUploader.tsx  # DnD sortable upload zone, up to 8 files
│   ├── PhoneFrame.tsx          # SVG frame, type: "android" | "ios"
│   ├── GooglePlayPreview.tsx   # GP listing rendered inside Android frame
│   └── AppStorePreview.tsx     # AS listing rendered inside iPhone frame
├── lib/
│   ├── types.ts                # AppData interface + StoreVisibility type
│   ├── useAppData.ts           # Hook: state + localStorage sync
│   ├── formatters.ts           # formatReviews, formatRating
│   └── export.ts               # html2canvas → PNG download
└── __tests__/
    ├── formatters.test.ts
    └── useAppData.test.ts
```

---

## Task 1: Project Scaffold + Git

**Files:**
- Create: `~/WebProjects/app-store-preview/` (Next.js project)
- Create: `.gitignore`

- [ ] **Step 1: Scaffold Next.js project**

```bash
cd ~/WebProjects
npx create-next-app@latest app-store-preview \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir no \
  --import-alias "@/*"
cd app-store-preview
```

Expected: project created, `npm run dev` starts on port 3000.

- [ ] **Step 2: Install dependencies**

```bash
npm install html2canvas @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 3: Configure Vitest**

Add to `package.json` scripts section:
```json
"test": "vitest",
"test:run": "vitest run"
```

Create `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
})
```

Create `vitest.setup.ts`:
```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 4: Git init + .gitignore**

```bash
git init
```

Verify `.gitignore` (created by create-next-app) includes:
```
node_modules/
.next/
.env*.local
```

Add to `.gitignore` if missing:
```
.DS_Store
*.pem
out/
```

- [ ] **Step 5: First commit**

```bash
git add .
git commit -m "chore: scaffold Next.js 15 + Tailwind + Vitest"
```

---

## Task 2: Types

**Files:**
- Create: `lib/types.ts`

- [ ] **Step 1: Write `lib/types.ts`**

```typescript
export interface AppData {
  appName: string
  subtitle: string
  developerName: string
  category: string
  rating: number
  reviewCount: number
  price: string        // "" = free, "0.99" = paid
  buttonType: 'GET' | 'price' | 'INSTALL'
  hasInAppPurchases: boolean
  iconDataUrl: string  // base64 or ""
  screenshots: string[] // base64 array, max 8
}

export interface StoreVisibility {
  googlePlay: boolean
  appStore: boolean
}

export const DEFAULT_APP_DATA: AppData = {
  appName: 'Your App Name',
  subtitle: 'App Subtitle',
  developerName: 'Developer Name',
  category: 'Utilities',
  rating: 4.5,
  reviewCount: 12000,
  price: '',
  buttonType: 'GET',
  hasInAppPurchases: false,
  iconDataUrl: '',
  screenshots: [],
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/types.ts
git commit -m "feat: add AppData types"
```

---

## Task 3: Formatters (TDD)

**Files:**
- Create: `lib/formatters.ts`
- Create: `__tests__/formatters.test.ts`

- [ ] **Step 1: Write failing tests**

Create `__tests__/formatters.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { formatReviews, formatRating, formatPrice } from '../lib/formatters'

describe('formatReviews', () => {
  it('formats numbers under 1000 as-is', () => {
    expect(formatReviews(999)).toBe('999')
  })
  it('formats 1000 as 1K', () => {
    expect(formatReviews(1000)).toBe('1K')
  })
  it('formats 12000 as 12K', () => {
    expect(formatReviews(12000)).toBe('12K')
  })
  it('formats 1500 as 1.5K', () => {
    expect(formatReviews(1500)).toBe('1.5K')
  })
  it('formats 1000000 as 1M', () => {
    expect(formatReviews(1000000)).toBe('1M')
  })
})

describe('formatRating', () => {
  it('rounds to 1 decimal', () => {
    expect(formatRating(4.567)).toBe('4.6')
  })
  it('clamps to 5.0 max', () => {
    expect(formatRating(6)).toBe('5.0')
  })
  it('clamps to 0 min', () => {
    expect(formatRating(-1)).toBe('0.0')
  })
})

describe('formatPrice', () => {
  it('returns "Free" for empty string', () => {
    expect(formatPrice('')).toBe('Free')
  })
  it('returns "$0.99" for "0.99"', () => {
    expect(formatPrice('0.99')).toBe('$0.99')
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm run test:run
```

Expected: `Cannot find module '../lib/formatters'`

- [ ] **Step 3: Implement `lib/formatters.ts`**

```typescript
export function formatReviews(n: number): string {
  if (n >= 1_000_000) return `${+(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${+(n / 1_000).toFixed(1)}K`
  return String(n)
}

export function formatRating(r: number): string {
  const clamped = Math.min(5, Math.max(0, r))
  return clamped.toFixed(1)
}

export function formatPrice(price: string): string {
  if (!price) return 'Free'
  return `$${price}`
}
```

- [ ] **Step 4: Run tests — verify pass**

```bash
npm run test:run
```

Expected: all 8 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/formatters.ts __tests__/formatters.test.ts
git commit -m "feat: add formatter utilities with tests"
```

---

## Task 4: useAppData Hook (TDD)

**Files:**
- Create: `lib/useAppData.ts`
- Create: `__tests__/useAppData.test.ts`

- [ ] **Step 1: Write failing tests**

Create `__tests__/useAppData.test.ts`:
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAppData } from '../lib/useAppData'
import { DEFAULT_APP_DATA } from '../lib/types'

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
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

  it('updates field and persists to localStorage', () => {
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
```

- [ ] **Step 2: Run — verify fail**

```bash
npm run test:run
```

Expected: `Cannot find module '../lib/useAppData'`

- [ ] **Step 3: Implement `lib/useAppData.ts`**

```typescript
'use client'
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
```

- [ ] **Step 4: Run — verify pass**

```bash
npm run test:run
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/useAppData.ts __tests__/useAppData.test.ts
git commit -m "feat: add useAppData hook with localStorage sync"
```

---

## Task 5: Export Utility

**Files:**
- Create: `lib/export.ts`

- [ ] **Step 1: Write `lib/export.ts`**

```typescript
import html2canvas from 'html2canvas'

export async function downloadPreview(
  elementId: string,
  filename: string
): Promise<void> {
  const el = document.getElementById(elementId)
  if (!el) return
  const canvas = await html2canvas(el, {
    useCORS: true,
    backgroundColor: null,
    scale: 2,
  })
  canvas.toBlob(blob => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }, 'image/png')
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/export.ts
git commit -m "feat: add html2canvas export utility"
```

---

## Task 6: CharCounter Component

**Files:**
- Create: `components/CharCounter.tsx`

- [ ] **Step 1: Write `components/CharCounter.tsx`**

```typescript
interface CharCounterProps {
  current: number
  max: number
}

export function CharCounter({ current, max }: CharCounterProps) {
  const pct = current / max
  const color =
    pct >= 1
      ? 'text-red-500'
      : pct >= 0.8
      ? 'text-amber-500'
      : 'text-gray-400 dark:text-gray-500'

  return (
    <span className={`text-xs tabular-nums ${color}`}>
      {current}/{max}
    </span>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/CharCounter.tsx
git commit -m "feat: add CharCounter component"
```

---

## Task 7: PhoneFrame Component

**Files:**
- Create: `components/PhoneFrame.tsx`

- [ ] **Step 1: Write `components/PhoneFrame.tsx`**

The frame is pure SVG/CSS. iPhone 15 style: Dynamic Island, side buttons, 393×852 viewport ratio. Android Pixel style: punch-hole camera, pill buttons.

```typescript
interface PhoneFrameProps {
  type: 'android' | 'ios'
  children: React.ReactNode
}

export function PhoneFrame({ type, children }: PhoneFrameProps) {
  if (type === 'ios') return <IPhoneFrame>{children}</IPhoneFrame>
  return <AndroidFrame>{children}</AndroidFrame>
}

function IPhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-[280px] select-none">
      {/* Outer shell */}
      <div className="relative bg-[#1a1a1a] rounded-[42px] p-[10px] shadow-2xl ring-1 ring-white/10">
        {/* Side buttons left */}
        <div className="absolute left-[-3px] top-[100px] w-[3px] h-8 bg-[#2a2a2a] rounded-l-sm" />
        <div className="absolute left-[-3px] top-[148px] w-[3px] h-12 bg-[#2a2a2a] rounded-l-sm" />
        <div className="absolute left-[-3px] top-[210px] w-[3px] h-12 bg-[#2a2a2a] rounded-l-sm" />
        {/* Side button right (power) */}
        <div className="absolute right-[-3px] top-[148px] w-[3px] h-16 bg-[#2a2a2a] rounded-r-sm" />
        {/* Screen */}
        <div className="relative bg-black rounded-[34px] overflow-hidden" style={{ aspectRatio: '393/852' }}>
          {/* Dynamic Island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[80px] h-[26px] bg-black rounded-full z-10" />
          {/* Content */}
          <div className="absolute inset-0 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

function AndroidFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-[280px] select-none">
      {/* Outer shell */}
      <div className="relative bg-[#1a1a1a] rounded-[36px] p-[10px] shadow-2xl ring-1 ring-white/10">
        {/* Side buttons right */}
        <div className="absolute right-[-3px] top-[120px] w-[3px] h-10 bg-[#2a2a2a] rounded-r-sm" />
        <div className="absolute right-[-3px] top-[170px] w-[3px] h-16 bg-[#2a2a2a] rounded-r-sm" />
        {/* Screen */}
        <div className="relative bg-[#0f0f0f] rounded-[28px] overflow-hidden" style={{ aspectRatio: '9/19.5' }}>
          {/* Punch-hole camera */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[14px] h-[14px] bg-black rounded-full z-10 ring-1 ring-[#1a1a1a]" />
          {/* Content */}
          <div className="absolute inset-0 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/PhoneFrame.tsx
git commit -m "feat: add PhoneFrame SVG component (iOS + Android)"
```

---

## Task 8: ScreenshotUploader Component

**Files:**
- Create: `components/ScreenshotUploader.tsx`

- [ ] **Step 1: Write `components/ScreenshotUploader.tsx`**

```typescript
'use client'
import { useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface ScreenshotUploaderProps {
  screenshots: string[]
  onChange: (screenshots: string[]) => void
}

export function ScreenshotUploader({ screenshots, onChange }: ScreenshotUploaderProps) {
  const sensors = useSensors(useSensor(PointerSensor))

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return
    const remaining = 8 - screenshots.length
    const toAdd = Array.from(files).slice(0, remaining)
    toAdd.forEach(file => {
      const reader = new FileReader()
      reader.onload = e => {
        const result = e.target?.result as string
        onChange([...screenshots, result])
      }
      reader.readAsDataURL(file)
    })
  }, [screenshots, onChange])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = screenshots.indexOf(active.id as string)
    const newIndex = screenshots.indexOf(over.id as string)
    onChange(arrayMove(screenshots, oldIndex, newIndex))
  }

  function removeScreenshot(index: number) {
    onChange(screenshots.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={screenshots} strategy={horizontalListSortingStrategy}>
          <div className="flex flex-wrap gap-2">
            {screenshots.map((src, i) => (
              <SortableScreenshot
                key={src}
                id={src}
                src={src}
                index={i}
                onRemove={removeScreenshot}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {screenshots.length < 8 && (
        <label className="flex items-center justify-center w-full h-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            + Add screenshots ({screenshots.length}/8)
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={e => handleFiles(e.target.files)}
          />
        </label>
      )}
    </div>
  )
}

function SortableScreenshot({
  id, src, index, onRemove,
}: {
  id: string
  src: string
  index: number
  onRemove: (i: number) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      className="relative group w-10 h-16 rounded overflow-hidden cursor-grab active:cursor-grabbing">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={`Screenshot ${index + 1}`} className="w-full h-full object-cover" />
      <button
        onClick={() => onRemove(index)}
        className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-bl"
        onPointerDown={e => e.stopPropagation()}
      >
        ×
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ScreenshotUploader.tsx
git commit -m "feat: add ScreenshotUploader with DnD reorder"
```

---

## Task 9: AppForm Component

**Files:**
- Create: `components/AppForm.tsx`

- [ ] **Step 1: Write `components/AppForm.tsx`**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add components/AppForm.tsx
git commit -m "feat: add AppForm left sidebar component"
```

---

## Task 10: GooglePlayPreview Component

**Files:**
- Create: `components/GooglePlayPreview.tsx`

- [ ] **Step 1: Write `components/GooglePlayPreview.tsx`**

```typescript
import { AppData } from '@/lib/types'
import { formatReviews, formatRating, formatPrice } from '@/lib/formatters'

interface GooglePlayPreviewProps {
  data: AppData
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => {
        const filled = rating >= i
        const half = !filled && rating >= i - 0.5
        return (
          <span key={i} className={`text-[10px] ${filled || half ? 'text-[#f5a623]' : 'text-gray-300'}`}>
            {half ? '½' : '★'}
          </span>
        )
      })}
    </div>
  )
}

export function GooglePlayPreview({ data }: GooglePlayPreviewProps) {
  const price = formatPrice(data.price)
  const rating = formatRating(data.rating)
  const reviews = formatReviews(data.reviewCount)

  return (
    <div className="bg-white text-[#202124] min-h-full text-[11px] font-['Roboto',sans-serif]">
      {/* Status bar */}
      <div className="flex justify-between items-center px-3 py-1 bg-white text-[9px] text-gray-500 pt-6">
        <span>9:41</span>
        <div className="flex gap-1 items-center">
          <span>▲▲▲</span>
          <span>WiFi</span>
          <span>🔋</span>
        </div>
      </div>

      {/* Top nav */}
      <div className="flex items-center px-3 py-2 gap-2">
        <span className="text-[#01875f] text-base">←</span>
        <div className="flex-1 bg-[#f1f3f4] rounded-full px-3 py-1.5 flex items-center gap-2">
          <span className="text-gray-400 text-xs">🔍</span>
          <span className="text-gray-400 text-[10px]">Search for apps & games</span>
        </div>
      </div>

      {/* App header */}
      <div className="px-4 py-3 flex gap-3">
        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
          {data.iconDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.iconDataUrl} alt="icon" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-medium text-[13px] leading-tight line-clamp-2 text-[#202124]">
            {data.appName || 'App Name'}
          </h1>
          <p className="text-[#01875f] text-[11px] mt-0.5">{data.developerName || 'Developer'}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[10px] font-medium">{rating}</span>
            <StarRating rating={data.rating} />
            <span className="text-gray-500 text-[9px]">({reviews})</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-4 flex gap-2 mb-3">
        <button className="flex-1 bg-[#01875f] text-white text-[11px] font-medium py-2 rounded-full">
          {price === 'Free' ? 'Install' : price}
        </button>
        {data.hasInAppPurchases && (
          <div className="flex items-center">
            <span className="text-gray-500 text-[9px]">In-app purchases</span>
          </div>
        )}
      </div>

      {/* Meta row */}
      <div className="px-4 flex gap-4 py-2 border-t border-b border-gray-100">
        {[
          { label: data.category || 'Category', sub: 'Category' },
          { label: `${rating}★`, sub: 'Rating' },
          { label: reviews, sub: 'Reviews' },
        ].map(item => (
          <div key={item.sub} className="flex-1 text-center">
            <div className="text-[11px] font-medium text-[#202124]">{item.label}</div>
            <div className="text-[9px] text-gray-500">{item.sub}</div>
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="px-4 py-3">
        <p className="text-[10px] text-gray-600 leading-relaxed line-clamp-3">
          {data.subtitle || 'Short description of your app goes here. Describe the key features in 80 characters.'}
        </p>
      </div>

      {/* Screenshots */}
      {data.screenshots.length > 0 && (
        <div className="px-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {data.screenshots.slice(0, 3).map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt={`Screenshot ${i + 1}`}
                className="h-36 w-auto rounded-lg object-cover flex-shrink-0"
              />
            ))}
          </div>
        </div>
      )}
      {data.screenshots.length === 0 && (
        <div className="px-4 flex gap-2">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-36 w-20 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center">
              <span className="text-gray-300 text-[9px] text-center">Screenshot {i + 1}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/GooglePlayPreview.tsx
git commit -m "feat: add GooglePlayPreview component"
```

---

## Task 11: AppStorePreview Component

**Files:**
- Create: `components/AppStorePreview.tsx`

- [ ] **Step 1: Write `components/AppStorePreview.tsx`**

```typescript
import { AppData } from '@/lib/types'
import { formatReviews, formatRating, formatPrice } from '@/lib/formatters'

interface AppStorePreviewProps {
  data: AppData
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`text-[10px] ${rating >= i ? 'text-[#FF9500]' : 'text-gray-300'}`}>★</span>
      ))}
    </div>
  )
}

export function AppStorePreview({ data }: AppStorePreviewProps) {
  const price = formatPrice(data.price)
  const rating = formatRating(data.rating)
  const reviews = formatReviews(data.reviewCount)
  const buttonLabel = price === 'Free' ? 'GET' : price

  return (
    <div className="bg-[#f2f2f7] text-[#1c1c1e] min-h-full text-[11px] font-[-apple-system,sans-serif]">
      {/* Status bar */}
      <div className="flex justify-between items-center px-4 pt-10 pb-2 bg-[#f2f2f7] text-[10px]">
        <span className="font-semibold">9:41</span>
        <div className="flex gap-1 items-center text-[9px]">
          <span>▲▲▲</span>
          <span>WiFi</span>
          <span>🔋</span>
        </div>
      </div>

      {/* Search bar */}
      <div className="px-4 pb-2">
        <div className="bg-white rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm">
          <span className="text-gray-400 text-xs">🔍</span>
          <span className="text-gray-400 text-[11px]">Search</span>
        </div>
      </div>

      {/* App header card */}
      <div className="mx-4 bg-white rounded-2xl p-4 shadow-sm mb-3">
        <div className="flex gap-3 items-start">
          {/* Icon */}
          <div className="w-16 h-16 rounded-[14px] overflow-hidden bg-gray-100 flex-shrink-0 shadow">
            {data.iconDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.iconDataUrl} alt="icon" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-blue-600" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-[13px] leading-tight line-clamp-1">
              {data.appName || 'App Name'}
            </h1>
            <p className="text-[#8e8e93] text-[10px] mt-0.5 line-clamp-1">
              {data.subtitle || 'App Subtitle'}
            </p>
            <p className="text-[#8e8e93] text-[10px] mt-0.5">{data.developerName}</p>
          </div>

          {/* GET button */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <button className="bg-[#007AFF] text-white text-[11px] font-semibold px-4 py-1.5 rounded-full">
              {buttonLabel}
            </button>
            {data.hasInAppPurchases && (
              <span className="text-[8px] text-[#8e8e93] text-center leading-tight">In-App<br/>Purchases</span>
            )}
          </div>
        </div>

        {/* Rating row */}
        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-semibold">{rating}</span>
            <StarRating rating={data.rating} />
          </div>
          <span className="text-[#8e8e93] text-[9px]">{reviews} Ratings</span>
          <span className="mx-2 text-gray-200">|</span>
          <span className="text-[#8e8e93] text-[9px]">{data.category}</span>
        </div>
      </div>

      {/* Screenshots */}
      <div className="px-4">
        {data.screenshots.length > 0 ? (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {data.screenshots.slice(0, 3).map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt={`Screenshot ${i + 1}`}
                className="h-48 w-auto rounded-xl object-cover flex-shrink-0 shadow"
              />
            ))}
          </div>
        ) : (
          <div className="flex gap-2">
            {[0, 1, 2].map(i => (
              <div key={i} className="h-48 w-24 rounded-xl bg-gray-100 flex-shrink-0 flex items-center justify-center shadow">
                <span className="text-gray-300 text-[9px] text-center">Screenshot {i + 1}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Description */}
      <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-[10px] text-[#3c3c43] leading-relaxed line-clamp-4">
          {data.subtitle || 'Your app description will appear here. Describe what makes your app great.'}
        </p>
        <p className="text-[#007AFF] text-[10px] mt-1">more</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/AppStorePreview.tsx
git commit -m "feat: add AppStorePreview component"
```

---

## Task 12: Header Component

**Files:**
- Create: `components/Header.tsx`

- [ ] **Step 1: Write `components/Header.tsx`**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add components/Header.tsx
git commit -m "feat: add Header with store toggles and dark mode"
```

---

## Task 13: Dark Mode Setup

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`
- Create: `lib/useDarkMode.ts`

- [ ] **Step 1: Enable class-based dark mode in `tailwind.config.ts`**

Open `tailwind.config.ts` and ensure `darkMode` is set to `'class'`:
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: { extend: {} },
  plugins: [],
}
export default config
```

- [ ] **Step 2: Create `lib/useDarkMode.ts`**

```typescript
'use client'
import { useState, useEffect } from 'react'

export function useDarkMode() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('dark-mode')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDark(stored !== null ? stored === 'true' : prefersDark)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('dark-mode', String(dark))
  }, [dark])

  return { dark, toggle: () => setDark(d => !d) }
}
```

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts lib/useDarkMode.ts
git commit -m "feat: add class-based dark mode with persistence"
```

---

## Task 14: Main Page Assembly

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Update `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body {
  height: 100%;
  overflow: hidden;
}

#__next, main {
  height: 100%;
}
```

- [ ] **Step 2: Update `app/layout.tsx`**

```typescript
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Store Preview Tool',
  description: 'Preview your app listing in App Store and Google Play simultaneously',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white h-screen overflow-hidden">
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Write `app/page.tsx`**

```typescript
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
import { StoreVisibility } from '@/lib/types'

export default function Home() {
  const { appData, setField, clearData } = useAppData()
  const { dark, toggle: toggleDark } = useDarkMode()
  const [visibility, setVisibility] = useState<StoreVisibility>({
    googlePlay: true,
    appStore: true,
  })

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
                    <GooglePlayPreview data={appData} />
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
                    <AppStorePreview data={appData} />
                  </PhoneFrame>
                </div>
              </div>
            )}

            {!visibility.googlePlay && !visibility.appStore && (
              <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-600">
                Enable a store preview using the toggles above
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run dev server and verify layout**

```bash
npm run dev
```

Open `http://localhost:3000`. Verify:
- Header shows with both toggles active
- Left sidebar shows form
- Right area shows two phone frames side by side
- Typing in App Name updates both previews instantly
- Toggle buttons hide/show each preview

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx app/layout.tsx app/globals.css
git commit -m "feat: assemble main page with dual preview layout"
```

---

## Task 15: Visual QA + GitHub Remote

**Files:**
- No code changes — verification + remote setup

- [ ] **Step 1: Full feature check in browser**

Start dev server: `npm run dev`

Check each feature:
1. Type in all form fields → previews update live ✓
2. Upload icon → appears in both phone frames ✓  
3. Upload 3+ screenshots → appear in both previews ✓
4. Drag to reorder screenshots → order updates ✓
5. Toggle Google Play off → only iPhone shows ✓
6. Toggle App Store off → only Android shows ✓
7. Toggle both off → empty state message shows ✓
8. Click "↓ Google Play" → downloads `googleplay-preview.png` ✓
9. Click "↓ App Store" → downloads `appstore-preview.png` ✓
10. Toggle dark mode → all surfaces switch ✓
11. Refresh page → form data restored from localStorage ✓
12. Click "Clear Data" → form resets to defaults ✓

- [ ] **Step 2: Run all tests**

```bash
npm run test:run
```

Expected: all tests pass.

- [ ] **Step 3: Create GitHub repo and push**

Go to github.com, create new repo named `app-store-preview` (public or private).

```bash
git remote add origin https://github.com/YOUR_USERNAME/app-store-preview.git
git branch -M main
git push -u origin main
```

- [ ] **Step 4: Final commit if any fixes**

```bash
git add -A
git commit -m "chore: final QA fixes"
git push
```

---

## Self-Review Checklist

- [x] **Spec coverage:** All spec requirements covered — dual previews, toggles, left sidebar form, drag&drop screenshots (up to 8), icon upload, character counters, dark mode, localStorage persistence, separate PNG exports, SVG phone frames (iOS Dynamic Island + Android punch-hole)
- [x] **No placeholders:** No TBD/TODO in any task
- [x] **Type consistency:** `AppData`, `StoreVisibility`, `setField` used consistently across all tasks. `downloadPreview(elementId, filename)` matches usage in page.tsx
- [x] **IDs match:** `id="gp-preview"` in page.tsx matches `downloadPreview('gp-preview', ...)` in AppForm
