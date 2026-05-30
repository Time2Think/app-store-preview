import { useRef } from 'react'
import { AppData, PreviewMode, UploadHandlers } from '@/lib/types'
import { formatReviews, formatRating, formatPrice } from '@/lib/formatters'

interface Props extends UploadHandlers {
  data: AppData
  dark?: boolean
  mode?: PreviewMode
}

type C = {
  bg: string
  surface1: string
  surface2: string
  text: string
  sub: string
  divider: string
  searchBg: string
  primary: string
  primaryText: string
  onPrimary: string
  outline: string
  chip: string
  chipActive: string
  navBg: string
}

function colors(dark: boolean): C {
  if (dark) return {
    bg: '#121212',
    surface1: '#1e1e1e',
    surface2: '#2d2d2d',
    text: '#e8eaed',
    sub: '#9aa0a6',
    divider: '#3c4043',
    searchBg: '#303134',
    primary: '#8ab4f8',
    primaryText: '#8ab4f8',
    onPrimary: '#1A73E8',
    outline: '#5f6368',
    chip: '#2d2d2d',
    chipActive: '#1e3a5f',
    navBg: '#1e1e1e',
  }
  return {
    bg: '#ffffff',
    surface1: '#f8f9fa',
    surface2: '#f1f3f4',
    text: '#202124',
    sub: '#5f6368',
    divider: '#e8eaed',
    searchBg: '#f1f3f4',
    primary: '#1A73E8',
    primaryText: '#1A73E8',
    onPrimary: '#ffffff',
    outline: '#dadce0',
    chip: '#f1f3f4',
    chipActive: '#d2e3fc',
    navBg: '#ffffff',
  }
}

function Stars({ rating, c, size = 12, prefix }: { rating: number, c: C, size?: number, prefix: string }) {
  const r = Math.round(rating * 10)
  return (
    <div className="flex gap-px">
      {[1, 2, 3, 4, 5].map(i => {
        const full = rating >= i
        const partial = !full && rating > i - 1
        const pct = partial ? Math.round((rating - (i - 1)) * 100) : 0
        const id = `${prefix}${i}x${r}`
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24">
            <defs>
              <linearGradient id={id}>
                <stop offset={`${full ? 100 : pct}%`} stopColor="#F5A623" />
                <stop offset={`${full ? 100 : pct}%`} stopColor={c.divider} />
              </linearGradient>
            </defs>
            <path fill={`url(#${id})`}
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        )
      })}
    </div>
  )
}

function DragScrollX({ children, className }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const startX = useRef(0)
  const scrollL = useRef(0)
  const stop = () => { dragging.current = false }
  return (
    <div ref={ref}
      className={`flex overflow-x-auto [&::-webkit-scrollbar]:hidden cursor-grab select-none ${className ?? ''}`}
      style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
      onMouseDown={e => { dragging.current = true; startX.current = e.clientX; scrollL.current = ref.current?.scrollLeft || 0 }}
      onMouseMove={e => { if (!dragging.current || !ref.current) return; e.preventDefault(); ref.current.scrollLeft = scrollL.current - (e.clientX - startX.current) }}
      onMouseUp={stop} onMouseLeave={stop}>
      {children}
    </div>
  )
}

function StatusBar({ c }: { c: C }) {
  return (
    <div className="flex justify-between items-center px-4 pt-4 pb-1 text-[11px] font-medium flex-shrink-0"
      style={{ color: c.text }}>
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" className="w-[13px] h-[13px] fill-current">
          <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
        </svg>
        <svg viewBox="0 0 24 24" className="w-[13px] h-[13px] fill-current">
          <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
        </svg>
      </div>
    </div>
  )
}

const GP_TABS = [
  { id: 'games', label: 'Games',
    path: 'M12 2a10 10 0 100 20A10 10 0 0012 2zM9 16H7v-2H5v-2h2v-2h2v2h2v2H9v2zm8-6h-2v2h-2v-2h2V8h2v2z' },
  { id: 'apps', label: 'Apps',
    path: 'M4 4h5v5H4zm0 6h5v5H4zm6-6h5v5h-5zm0 6h5v5h-5zm6-6h4v5h-4zm0 6h4v5h-4z' },
  { id: 'search', label: 'Search',
    path: 'M15.5 14h-.79l-.28-.27A6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z' },
  { id: 'books', label: 'Books',
    path: 'M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H6V4h2v8l2.5-1.5L13 12V4h5v16z' },
  { id: 'you', label: 'You',
    path: 'M12 12c2.7 0 4-1.3 4-4s-1.3-4-4-4-4 1.3-4 4 1.3 4 4 4zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z' },
]

function BottomNavBar({ c, activeTab = 'search' }: { c: C, activeTab?: string }) {
  return (
    <div className="flex-shrink-0 flex justify-around items-end py-2 pb-3"
      style={{ background: c.navBg, borderTop: `1px solid ${c.divider}` }}>
      {GP_TABS.map(tab => {
        const active = tab.id === activeTab
        return (
          <div key={tab.id} className="flex flex-col items-center gap-[2px] px-1 relative">
            {active && (
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-10 h-7 rounded-full"
                style={{ background: c.chipActive }} />
            )}
            <svg viewBox="0 0 24 24" width="20" height="20" className="relative z-10"
              style={{ fill: active ? c.primary : c.sub }}>
              <path d={tab.path} />
            </svg>
            <span className="text-[8px] font-medium relative z-10"
              style={{ color: active ? c.primary : c.sub }}>
              {tab.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function UploadIconZone({ icon, size, borderRadius, onUpload, gradient = 'from-blue-500 to-purple-600' }: {
  icon: string | null
  size: number
  borderRadius: string
  onUpload?: (dataUrl: string) => void
  gradient?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File) {
    const reader = new FileReader()
    reader.onload = e => onUpload?.(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div
      className="overflow-hidden flex-shrink-0 relative"
      style={{ width: size, height: size, borderRadius, cursor: onUpload ? 'pointer' : 'default' }}
      onClick={() => onUpload && inputRef.current?.click()}
      onDragOver={e => { if (onUpload) e.preventDefault() }}
      onDrop={e => {
        if (!onUpload) return
        e.preventDefault()
        const file = e.dataTransfer.files?.[0]
        if (file) handleFile(file)
      }}
    >
      {icon
        ? <img src={icon} alt="icon" className="w-full h-full object-cover" />
        : <div className={`w-full h-full bg-gradient-to-br ${gradient}`} />}
      {onUpload && !icon && (
        <div className="absolute inset-0 flex items-end justify-center pb-1.5">
          <span className="text-[7px] text-white/70 bg-black/30 px-1.5 py-0.5 rounded-full">tap to upload</span>
        </div>
      )}
      {onUpload && (
        <input ref={inputRef} type="file" accept="image/*" className="sr-only"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
      )}
    </div>
  )
}

function UploadScreenshotSlot({ src, index, height, width, borderRadius, c, onUpload }: {
  src?: string, index: number, height: number, width: number,
  borderRadius: string, c: C, onUpload?: (i: number, d: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File) {
    const reader = new FileReader()
    reader.onload = e => onUpload?.(index, e.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div
      className="flex-shrink-0 relative overflow-hidden"
      style={{ width, height, borderRadius, background: src ? 'transparent' : c.surface2, cursor: onUpload ? 'pointer' : 'default' }}
      onClick={() => onUpload && inputRef.current?.click()}
      onDragOver={e => { if (onUpload) e.preventDefault() }}
      onDrop={e => {
        if (!onUpload) return
        e.preventDefault()
        const file = e.dataTransfer.files?.[0]
        if (file) handleFile(file)
      }}
    >
      {src
        ? <img src={src} alt="" className="w-full h-full object-cover" />
        : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1">
            {onUpload && <svg viewBox="0 0 24 24" className="w-4 h-4" style={{ fill: c.sub }}><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>}
            <span className="text-[7px] text-center" style={{ color: c.sub }}>{onUpload ? 'Add' : `SS ${index + 1}`}</span>
          </div>
        )}
      {onUpload && (
        <input ref={inputRef} type="file" accept="image/*" className="sr-only"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
      )}
    </div>
  )
}

const GP_COMPETITORS = [
  {
    renderIcon: () => (
      <svg viewBox="0 0 60 60" className="w-full h-full">
        <rect width="60" height="60" rx="14" fill="#58CC02"/>
        <circle cx="30" cy="28" r="16" fill="white"/>
        <circle cx="24" cy="25" r="3.5" fill="#1CB0F6"/>
        <circle cx="36" cy="25" r="3.5" fill="#1CB0F6"/>
        <circle cx="24" cy="25" r="2" fill="#1C1C1E"/>
        <circle cx="36" cy="25" r="2" fill="#1C1C1E"/>
        <path d="M26 31 Q30 35 34 31" stroke="#FF9600" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M18 19 L22 25 L14 25 Z" fill="white"/>
        <path d="M42 19 L46 25 L38 25 Z" fill="white"/>
      </svg>
    ),
    name: 'Duolingo: Language Lessons', developer: 'Duolingo',
    category: 'Education', tagline: 'Learn a new language for free',
    rating: 4.7, size: '68 MB', downloads: '500M+', prefix: 'gpc1',
  },
  {
    renderIcon: () => (
      <svg viewBox="0 0 60 60" className="w-full h-full">
        <rect width="60" height="60" rx="14" fill="#191414"/>
        <circle cx="30" cy="30" r="18" fill="#1DB954"/>
        <path d="M18 24 Q30 20 42 24" stroke="#191414" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
        <path d="M20 30 Q30 26 40 30" stroke="#191414" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
        <path d="M22 36 Q30 32 38 36" stroke="#191414" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      </svg>
    ),
    name: 'Spotify: Music & Podcasts', developer: 'Spotify AB',
    category: 'Music & Audio', tagline: 'Your AI Dance Video Awaits',
    rating: 4.3, size: '32 MB', downloads: '1B+', prefix: 'gpc2',
  },
  {
    renderIcon: () => (
      <svg viewBox="0 0 60 60" className="w-full h-full">
        <rect width="60" height="60" rx="14" fill="#7D2AE8"/>
        <path d="M40 20 Q28 10 19 20 Q10 30 19 40 Q28 50 40 40" stroke="white" strokeWidth="7" strokeLinecap="round" fill="none"/>
      </svg>
    ),
    name: 'Canva: Design & AI Editor', developer: 'Canva',
    category: 'Art & Design', tagline: 'Photo, Video & Graphic Design',
    rating: 4.8, size: '29 MB', downloads: '500M+', prefix: 'gpc3',
  },
]

function SearchView({ data, c, onUploadIcon, onUploadScreenshot }: {
  data: AppData, c: C, onUploadIcon?: (d: string) => void, onUploadScreenshot?: (i: number, d: string) => void
}) {
  const price = formatPrice(data.price)
  const rating = formatRating(data.rating)
  const reviews = formatReviews(data.reviewCount)

  // User app screenshots
  const maxShots = 10
  const userSlots = Math.min(
    Math.max(data.screenshots.length + (onUploadScreenshot && data.screenshots.length < maxShots ? 1 : 0), 3),
    maxShots
  )

  return (
    <div className="h-full flex flex-col" style={{ background: c.bg }}>
      <StatusBar c={c} />

      {/* Top bar: back + title + search + mic — sticky */}
      <div className="flex-shrink-0 flex items-center gap-2 px-3 pb-2" style={{ background: c.bg }}>
        <button style={{ color: c.text }}>
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </button>
        <span className="flex-1 font-bold text-[16px]" style={{ color: c.text }}>Animation apps</span>
        <button style={{ color: c.text }}>
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M15.5 14h-.79l-.28-.27A6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
        </button>
        <button style={{ color: c.text }}>
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1 1.93c-3.94-.49-7-3.85-7-7.93h2c0 3.31 2.69 6 6 6s6-2.69 6-6h2c0 4.08-3.06 7.44-7 7.93V19h3v2H9v-2h3v-3.07z"/>
          </svg>
        </button>
      </div>

      {/* Filter chips sticky */}
      <div className="flex-shrink-0 flex gap-2 px-3 pb-2 overflow-x-auto [&::-webkit-scrollbar]:hidden"
        style={{ background: c.bg }}>
        {[
          { label: 'Rating ✓', active: true },
          { label: 'Family', active: false },
          { label: 'Premium', active: false },
          { label: 'New', active: false },
        ].map(chip => (
          <div key={chip.label}
            className="flex-shrink-0 flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap"
            style={{
              border: `1px solid ${chip.active ? c.primary : c.outline}`,
              color: chip.active ? c.primary : c.sub,
              background: chip.active ? c.chipActive : 'transparent',
            }}>
            {chip.label}
          </div>
        ))}
      </div>

      {/* Sponsored label */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 pb-1" style={{ background: c.bg }}>
        <span className="text-[10px]" style={{ color: c.sub }}>Sponsored</span>
        <button style={{ color: c.sub }}>
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </button>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
        {/* User app item */}
        <div style={{ borderBottom: `0.5px solid ${c.divider}` }}>
          {/* List row */}
          <div className="flex items-center gap-3 px-4 py-3">
            <UploadIconZone
              icon={data.iconDataUrl || null}
              size={80}
              borderRadius="14px"
              onUpload={onUploadIcon}
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[15px] line-clamp-1" style={{ color: c.text }}>
                {data.appName || 'App Name'}
              </p>
              <p className="text-[12px] mt-0.5 line-clamp-1" style={{ color: c.sub }}>
                {data.developerName || 'Developer'} • {data.category || 'App'}
              </p>
              <p className="text-[12px] mt-0.5 italic line-clamp-1" style={{ color: c.sub }}>
                {data.subtitle || 'App Subtitle'}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[11px]" style={{ color: c.sub }}>{rating}★</span>
                <span className="text-[10px]" style={{ color: c.sub }}>·</span>
                <span className="text-[10px]" style={{ color: c.sub }}>App</span>
                <span className="text-[10px]" style={{ color: c.sub }}>·</span>
                <span className="text-[10px]" style={{ color: c.sub }}>↓{formatReviews(data.reviewCount)}+</span>
              </div>
            </div>
          </div>
          {/* Screenshots row for user app */}
          <DragScrollX className="px-4 pb-3 gap-2">
            {Array.from({ length: userSlots }).map((_, i) => (
              <UploadScreenshotSlot
                key={i}
                src={data.screenshots[i]}
                index={i}
                height={120}
                width={data.screenshots[i] ? 90 : 80}
                borderRadius="8px"
                c={c}
                onUpload={onUploadScreenshot}
              />
            ))}
          </DragScrollX>
        </div>

        {/* Competitor items */}
        {GP_COMPETITORS.map((comp, idx) => (
          <div key={idx} style={{ borderBottom: `0.5px solid ${c.divider}` }}>
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-[80px] h-[80px] flex-shrink-0 overflow-hidden" style={{ borderRadius: '14px' }}>
                {comp.renderIcon()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[15px] line-clamp-1" style={{ color: c.text }}>{comp.name}</p>
                <p className="text-[12px] mt-0.5 line-clamp-1" style={{ color: c.sub }}>
                  {comp.developer} • {comp.category}
                </p>
                <p className="text-[12px] mt-0.5 italic line-clamp-1" style={{ color: c.sub }}>{comp.tagline}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[11px]" style={{ color: c.sub }}>{formatRating(comp.rating)}★</span>
                  <span className="text-[10px]" style={{ color: c.sub }}>·</span>
                  <span className="text-[10px]" style={{ color: c.sub }}>{comp.size}</span>
                  <span className="text-[10px]" style={{ color: c.sub }}>·</span>
                  <span className="text-[10px]" style={{ color: c.sub }}>↓{comp.downloads}</span>
                </div>
              </div>
            </div>
            {/* Placeholder screenshot strips for competitors */}
            <div className="flex gap-2 px-4 pb-3">
              {[0, 1, 2].map(i => (
                <div key={i} className="flex-shrink-0 rounded-[8px]"
                  style={{ width: 80, height: 120, background: c.surface2 }} />
              ))}
            </div>
          </div>
        ))}

        <div className="h-2" />
      </div>

      <BottomNavBar c={c} activeTab="search" />
    </div>
  )
}

function DetailView({ data, c, onUploadIcon, onUploadScreenshot }: {
  data: AppData, c: C, onUploadIcon?: (d: string) => void, onUploadScreenshot?: (i: number, d: string) => void
}) {
  const price = formatPrice(data.price)
  const rating = formatRating(data.rating)
  const reviews = formatReviews(data.reviewCount)

  const maxShots = 10
  const slots = Math.min(Math.max(data.screenshots.length + (onUploadScreenshot && data.screenshots.length < maxShots ? 1 : 0), 3), maxShots)

  return (
    <div className="h-full flex flex-col" style={{ background: c.bg }}>
      <StatusBar c={c} />

      {/* Top app bar */}
      <div className="flex-shrink-0 flex items-center px-2 pb-2 gap-1" style={{ background: c.bg }}>
        <button className="p-2 rounded-full" style={{ color: c.text }}>
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </button>
        <div className="flex-1" />
        <button className="p-2 rounded-full" style={{ color: c.text }}>
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
        {/* App header */}
        <div className="px-4 pb-3 flex gap-4">
          <UploadIconZone
            icon={data.iconDataUrl || null}
            size={88}
            borderRadius="18px"
            onUpload={onUploadIcon}
          />
          <div className="flex-1 min-w-0 pt-0.5">
            <h1 className="font-bold leading-snug" style={{ color: c.text, fontSize: '18px' }}>
              {data.appName || 'App Name'}
            </h1>
            <p className="text-[13px] mt-1 font-medium" style={{ color: c.primaryText }}>
              {data.developerName || 'Developer'}
            </p>
            {(data.hasInAppPurchases) && (
              <p className="text-[12px] mt-0.5" style={{ color: c.sub }}>
                Contains ads · In-app purchases
              </p>
            )}
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[12px]" style={{ color: c.sub }}>{rating} ★</span>
              <span className="text-[11px]" style={{ color: c.sub }}>{reviews} reviews</span>
            </div>
          </div>
        </div>

        {/* Info badges row */}
        <div className="flex mx-4 mb-3 rounded-xl overflow-hidden" style={{ border: `1px solid ${c.outline}` }}>
          {([
            { top: `${rating}★`, sub: `${reviews} reviews`, icon: 'ⓘ' },
            { top: '3+', sub: 'Rated for 3+', icon: '' },
            { top: '↓', sub: '96 MB', icon: '' },
          ] as { top: string, sub: string, icon: string }[]).map((item, idx, arr) => (
            <div key={idx} className="flex-1 flex flex-col items-center py-2 px-1 text-center"
              style={{ borderRight: idx < arr.length - 1 ? `1px solid ${c.outline}` : 'none' }}>
              <div className="text-[13px] font-bold" style={{ color: c.text }}>{item.top}</div>
              <div className="text-[9px] mt-0.5" style={{ color: c.sub }}>{item.sub}</div>
            </div>
          ))}
        </div>

        {/* Install button */}
        <div className="px-4 pb-3">
          <button className="w-full py-3 rounded-lg text-[15px] font-medium"
            style={{ background: '#1A73E8', color: '#ffffff' }}>
            {price === 'Free' ? 'Install' : price}
          </button>
        </div>

        {/* Screenshots */}
        <div style={{ height: '0.5px', background: c.divider }} />
        <div className="py-3">
          <DragScrollX className="px-4 gap-3">
            {Array.from({ length: slots }).map((_, i) => (
              <UploadScreenshotSlot
                key={i}
                src={data.screenshots[i]}
                index={i}
                height={120}
                width={data.screenshots[i] ? 200 : 180}
                borderRadius="8px"
                c={c}
                onUpload={onUploadScreenshot}
              />
            ))}
          </DragScrollX>
        </div>

        {/* About section */}
        <div style={{ height: '0.5px', background: c.divider }} />
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[14px] font-medium" style={{ color: c.text }}>About this app</h2>
            <svg viewBox="0 0 24 24" className="w-4 h-4" style={{ fill: c.primaryText }}>
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </div>
          <p className="text-[12px] leading-relaxed line-clamp-3" style={{ color: c.sub }}>
            {data.subtitle || 'Short description of your app. Up to 80 characters appear here in search results.'}
          </p>
          <button className="text-[12px] mt-1 font-medium" style={{ color: c.primaryText }}>read more</button>
        </div>

        {/* Ratings section */}
        <div style={{ height: '8px', background: c.surface1 }} />
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[14px] font-medium" style={{ color: c.text }}>Ratings and reviews</h2>
            <svg viewBox="0 0 24 24" className="w-4 h-4" style={{ fill: c.primaryText }}>
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </div>
          <div className="flex items-end gap-3">
            <div className="text-center">
              <div className="text-[40px] font-light leading-none" style={{ color: c.text }}>{rating}</div>
              <Stars rating={data.rating} c={c} size={10} prefix="gpdt" />
              <div className="text-[9px] mt-0.5" style={{ color: c.sub }}>{reviews} reviews</div>
            </div>
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map(star => {
                const pct = star === 5 ? 80 : star === 4 ? 12 : star === 3 ? 4 : 2
                return (
                  <div key={star} className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[8px] w-2 text-right" style={{ color: c.sub }}>{star}</span>
                    <div className="flex-1 rounded-full h-[3px] overflow-hidden" style={{ background: c.divider }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c.primary }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Similar apps */}
        <div style={{ height: '8px', background: c.surface1 }} />
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[14px] font-medium" style={{ color: c.text }}>Similar apps</h2>
            <svg viewBox="0 0 24 24" className="w-4 h-4" style={{ fill: c.primaryText }}>
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {GP_COMPETITORS.map((comp, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div className="w-[60px] h-[60px] overflow-hidden" style={{ borderRadius: '14px' }}>
                  {comp.renderIcon()}
                </div>
                <span className="text-[9px] text-center line-clamp-2 leading-tight" style={{ color: c.text }}>
                  {comp.name.split(':')[0]}
                </span>
                <div className="flex items-center gap-0.5">
                  <span className="text-[8px]" style={{ color: c.sub }}>{formatRating(comp.rating)}★</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-4" />
      </div>

      <BottomNavBar c={c} activeTab="search" />
    </div>
  )
}

export function GooglePlayPreview({ data, dark = false, mode = 'detail', onUploadIcon, onUploadScreenshot }: Props) {
  const c = colors(dark)
  return mode === 'search'
    ? <SearchView data={data} c={c} onUploadIcon={onUploadIcon} onUploadScreenshot={onUploadScreenshot} />
    : <DetailView data={data} c={c} onUploadIcon={onUploadIcon} onUploadScreenshot={onUploadScreenshot} />
}
