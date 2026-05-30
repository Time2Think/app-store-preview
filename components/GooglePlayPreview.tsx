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
  searchText: string
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
    bg: '#141218',
    surface1: '#1d1b20',
    surface2: '#2b2930',
    text: '#e6e1e5',
    sub: '#938f99',
    divider: '#49454f',
    searchBg: '#2b2930',
    searchText: '#938f99',
    primary: '#80cbc4',
    primaryText: '#80cbc4',
    onPrimary: '#00201e',
    outline: '#49454f',
    chip: '#2b2930',
    chipActive: '#4a4458',
    navBg: '#1d1b20',
  }
  return {
    bg: '#fffbfe',
    surface1: '#f7f2fa',
    surface2: '#f3edf7',
    text: '#1c1b1f',
    sub: '#49454f',
    divider: '#e7e0ec',
    searchBg: '#ece6f0',
    searchText: '#49454f',
    primary: '#006a4b',
    primaryText: '#006a4b',
    onPrimary: '#ffffff',
    outline: '#79747e',
    chip: '#ece6f0',
    chipActive: '#e8def8',
    navBg: '#fffbfe',
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

function BottomNavBar({ c, activeTab = 'apps' }: { c: C, activeTab?: string }) {
  const tabs = [
    { id: 'games', label: 'Games', path: 'M12 2a10 10 0 100 20A10 10 0 0012 2zM9 16H7v-2H5v-2h2v-2h2v2h2v2H9v2zm8-6h-2v2h-2v-2h2V8h2v2z' },
    { id: 'apps', label: 'Apps', path: 'M4 4h5v5H4zm0 6h5v5H4zm6-6h5v5h-5zm0 6h5v5h-5zm6-6h4v5h-4zm0 6h4v5h-4z' },
    { id: 'movies', label: 'Movies', path: 'M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z' },
    { id: 'books', label: 'Books', path: 'M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H6V4h2v8l2.5-1.5L13 12V4h5v16z' },
    { id: 'foryou', label: 'For you', path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z' },
  ]
  return (
    <div className="flex-shrink-0 flex justify-around items-center py-2 pb-3"
      style={{ background: c.navBg, borderTop: `1px solid ${c.divider}` }}>
      {tabs.map(tab => {
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
  { gradient: 'from-green-400 to-teal-500', name: 'Duolingo: Language Lessons', developer: 'Duolingo', rating: 4.7, reviews: '14.2M', prefix: 'gpc1' },
  { gradient: 'from-purple-500 to-indigo-600', name: 'Spotify: Music & Podcasts', developer: 'Spotify AB', rating: 4.3, reviews: '32.1M', prefix: 'gpc2' },
  { gradient: 'from-yellow-400 to-orange-500', name: 'Canva: Design & AI Editor', developer: 'Canva', rating: 4.8, reviews: '6.5M', prefix: 'gpc3' },
]

function SearchView({ data, c, onUploadIcon, onUploadScreenshot }: { data: AppData, c: C, onUploadIcon?: (d: string) => void, onUploadScreenshot?: (i: number, d: string) => void }) {
  const price = formatPrice(data.price)
  const rating = formatRating(data.rating)
  const reviews = formatReviews(data.reviewCount)

  return (
    <div className="h-full flex flex-col" style={{ background: c.bg }}>
      <StatusBar c={c} />

      {/* M3 Search bar */}
      <div className="flex-shrink-0 px-3 pb-2 flex items-center gap-2">
        <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-full"
          style={{ background: c.searchBg }}>
          <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" style={{ fill: c.searchText }}>
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" style={{ fill: c.searchText }}>
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <span className="text-[13px] flex-1" style={{ color: c.searchText }}>Search apps &amp; games</span>
        </div>
        <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-[10px] font-bold"
          style={{ background: c.primary, color: c.onPrimary }}>U</div>
      </div>

      {/* Filter chips */}
      <div className="flex-shrink-0 flex gap-2 px-3 pb-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
        {['Apps', 'Games', 'Books', 'Movies', 'Podcasts'].map((chip, i) => (
          <div key={chip} className="px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap flex-shrink-0"
            style={{
              background: i === 0 ? c.primary : c.chip,
              color: i === 0 ? c.onPrimary : c.sub,
            }}>
            {chip}
          </div>
        ))}
      </div>

      {/* Scrollable results */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
        {/* User app */}
        <div className="flex items-center gap-3 px-4 py-3">
          <UploadIconZone
            icon={data.iconDataUrl || null}
            size={56}
            borderRadius="12px"
            onUpload={onUploadIcon}
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-[13px] line-clamp-1" style={{ color: c.text }}>
              {data.appName || 'App Name'}
            </p>
            <p className="text-[11px] mt-0.5 font-medium line-clamp-1" style={{ color: c.primaryText }}>
              {data.developerName || 'Developer'}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[10px]" style={{ color: c.sub }}>{rating}</span>
              <Stars rating={data.rating} c={c} size={10} prefix="gpusr" />
              <span className="text-[9px]" style={{ color: c.sub }}>({reviews})</span>
              {data.hasInAppPurchases && <span className="text-[9px] ml-1" style={{ color: c.sub }}>• In-app purchases</span>}
            </div>
          </div>
          <button className="px-3 py-1.5 rounded-full text-[12px] font-medium flex-shrink-0"
            style={{ background: c.primary, color: c.onPrimary }}>
            {price === 'Free' ? 'Install' : price}
          </button>
        </div>

        <div style={{ height: '1px', background: c.divider }} />

        {GP_COMPETITORS.map((comp, idx) => (
          <div key={idx}>
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-[56px] h-[56px] rounded-[12px] overflow-hidden flex-shrink-0">
                <div className={`w-full h-full bg-gradient-to-br ${comp.gradient}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[13px] line-clamp-1" style={{ color: c.text }}>{comp.name}</p>
                <p className="text-[11px] mt-0.5 font-medium" style={{ color: c.primaryText }}>{comp.developer}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[10px]" style={{ color: c.sub }}>{formatRating(comp.rating)}</span>
                  <Stars rating={comp.rating} c={c} size={10} prefix={comp.prefix} />
                  <span className="text-[9px]" style={{ color: c.sub }}>({comp.reviews})</span>
                </div>
              </div>
              <button className="px-3 py-1.5 rounded-full text-[12px] font-medium flex-shrink-0"
                style={{ background: c.primary, color: c.onPrimary }}>Install</button>
            </div>
            <div style={{ height: '1px', background: c.divider }} />
          </div>
        ))}
        <div className="h-2" />
      </div>

      <BottomNavBar c={c} activeTab="apps" />
    </div>
  )
}

function DetailView({ data, c, onUploadIcon, onUploadScreenshot }: { data: AppData, c: C, onUploadIcon?: (d: string) => void, onUploadScreenshot?: (i: number, d: string) => void }) {
  const price = formatPrice(data.price)
  const rating = formatRating(data.rating)
  const reviews = formatReviews(data.reviewCount)

  const maxShots = 10
  const slots = Math.min(Math.max(data.screenshots.length + (onUploadScreenshot && data.screenshots.length < maxShots ? 1 : 0), 3), maxShots)

  return (
    <div className="h-full flex flex-col" style={{ background: c.bg }}>
      <StatusBar c={c} />

      {/* M3 TopAppBar */}
      <div className="flex-shrink-0 flex items-center px-2 pb-2 gap-1" style={{ background: c.bg }}>
        <button className="p-2 rounded-full" style={{ color: c.text }}>
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </button>
        <div className="flex-1" />
        <button className="p-2 rounded-full" style={{ color: c.text }}>
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
          </svg>
        </button>
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
            size={80}
            borderRadius="20px"
            onUpload={onUploadIcon}
          />
          <div className="flex-1 min-w-0 pt-0.5">
            <h1 className="font-medium text-[16px] leading-snug" style={{ color: c.text }}>
              {data.appName || 'App Name'}
            </h1>
            <p className="text-[13px] mt-1 font-medium" style={{ color: c.primaryText }}>
              {data.developerName || 'Developer'}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[12px] font-medium" style={{ color: c.text }}>{rating}</span>
              <Stars rating={data.rating} c={c} size={11} prefix="gpdt" />
              <span className="text-[10px]" style={{ color: c.sub }}>({reviews})</span>
            </div>
            <p className="text-[11px] mt-0.5" style={{ color: c.sub }}>{data.category || 'Utilities'}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-4 pb-3 flex gap-2">
          <button className="flex-1 py-2.5 rounded-full text-[13px] font-medium tracking-wide"
            style={{ background: c.primary, color: c.onPrimary }}>
            {price === 'Free' ? 'Install' : price}
          </button>
          <button className="px-5 py-2.5 rounded-full text-[13px] font-medium"
            style={{ border: `1px solid ${c.outline}`, color: c.primaryText, background: 'transparent' }}>
            Wishlist
          </button>
        </div>

        {data.hasInAppPurchases && (
          <div className="px-4 pb-2">
            <span className="text-[10px] px-2.5 py-1 rounded-full" style={{ color: c.sub, background: c.chip }}>
              In-app purchases
            </span>
          </div>
        )}

        <div style={{ height: '1px', background: c.divider, margin: '0 16px 12px' }} />

        {/* M3 info chips */}
        <div className="flex px-4 pb-3 gap-0">
          {([
            { val: data.category || 'Games', label: 'Category' },
            { val: rating + '★', label: 'Rating' },
            { val: reviews, label: 'Reviews' },
          ] as { val: string, label: string }[]).map((item, idx, arr) => (
            <div key={item.label}
              className={`flex-1 text-center py-2 rounded-xl ${idx === 0 ? 'mr-1' : idx === arr.length - 1 ? 'ml-1' : 'mx-1'}`}
              style={{ background: c.surface1 }}>
              <div className="text-[13px] font-semibold" style={{ color: c.text }}>{item.val}</div>
              <div className="text-[9px] mt-0.5" style={{ color: c.sub }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Screenshots */}
        <div style={{ height: '1px', background: c.divider, margin: '0 16px 12px' }} />
        <div className="px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollSnapType: 'x mandatory' }}>
            {Array.from({ length: slots }).map((_, i) => (
              <div key={i} style={{ scrollSnapAlign: 'start' }}>
                <UploadScreenshotSlot
                  src={data.screenshots[i]}
                  index={i}
                  height={130}
                  width={data.screenshots[i] ? 80 : 72}
                  borderRadius="12px"
                  c={c}
                  onUpload={onUploadScreenshot}
                />
              </div>
            ))}
          </div>
        </div>

        {/* About */}
        <div style={{ height: '1px', background: c.divider, margin: '0 16px 12px' }} />
        <div className="px-4 pb-4">
          <h2 className="text-[14px] font-medium mb-2" style={{ color: c.text }}>About this app</h2>
          <p className="text-[11px] leading-relaxed line-clamp-3" style={{ color: c.sub }}>
            {data.subtitle || 'Short description of your app. Up to 80 characters appear here in search results.'}
          </p>
          <button className="text-[11px] mt-1 font-medium" style={{ color: c.primaryText }}>read more</button>
        </div>

        <div className="h-2" />
      </div>

      <BottomNavBar c={c} activeTab="apps" />
    </div>
  )
}

export function GooglePlayPreview({ data, dark = false, mode = 'detail', onUploadIcon, onUploadScreenshot }: Props) {
  const c = colors(dark)
  return mode === 'search'
    ? <SearchView data={data} c={c} onUploadIcon={onUploadIcon} onUploadScreenshot={onUploadScreenshot} />
    : <DetailView data={data} c={c} onUploadIcon={onUploadIcon} onUploadScreenshot={onUploadScreenshot} />
}
