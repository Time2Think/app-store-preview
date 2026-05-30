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
  card: string
  text: string
  sub: string
  sep: string
  searchBg: string
  searchText: string
  btnBg: string
  starEmpty: string
  border: string
  tabBar: string
}

function colors(dark: boolean): C {
  if (dark) return {
    bg: '#000000',
    card: '#1c1c1e',
    text: '#ffffff',
    sub: 'rgba(235,235,245,0.6)',
    sep: '#38383a',
    searchBg: '#1c1c1e',
    searchText: '#636366',
    btnBg: 'rgba(0,122,255,0.18)',
    starEmpty: '#3a3a3c',
    border: '#38383a',
    tabBar: '#1c1c1e',
  }
  return {
    bg: '#f2f2f7',
    card: '#ffffff',
    text: '#1c1c1e',
    sub: '#8e8e93',
    sep: '#c7c7cc',
    searchBg: '#ffffff',
    searchText: '#8e8e93',
    btnBg: '#e8f0fe',
    starEmpty: '#D1D5DB',
    border: '#e5e5ea',
    tabBar: 'rgba(249,249,249,0.94)',
  }
}

function Stars({ rating, size = 10, emptyColor, prefix }: {
  rating: number, size?: number, emptyColor: string, prefix: string
}) {
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
                <stop offset={`${full ? 100 : pct}%`} stopColor="#FF9500" />
                <stop offset={`${full ? 100 : pct}%`} stopColor={emptyColor} />
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
    <div className="flex justify-between items-center px-5 pt-8 pb-1 text-[12px] font-semibold flex-shrink-0"
      style={{ color: c.text }}>
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] fill-current">
          <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
        </svg>
        <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] fill-current">
          <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
        </svg>
      </div>
    </div>
  )
}

function BottomTabBar({ c }: { c: C }) {
  const tabs = [
    {
      label: 'Today', active: false,
      path: 'M3 4a2 2 0 012-2h14a2 2 0 012 2v16a2 2 0 01-2 2H5a2 2 0 01-2-2V4zm2 0v16h14V4H5zm2 3h10v2H7V7zm0 4h7v2H7v-2z'
    },
    {
      label: 'Games', active: false,
      path: 'M12 2a10 10 0 100 20A10 10 0 0012 2zM9 16H7v-2H5v-2h2v-2h2v2h2v2H9v2zm8-6h-2v2h-2v-2h2V8h2v2z'
    },
    {
      label: 'Apps', active: false,
      path: 'M4 4h5v5H4zm0 6h5v5H4zm6-6h5v5h-5zm0 6h5v5h-5zm6-6h4v5h-4zm0 6h4v5h-4z'
    },
    {
      label: 'Arcade', active: false,
      path: 'M12 1L9.5 8.5H2l6.2 4.5L5.7 20 12 15.5 18.3 20l-2.5-7L22 8.5h-7.5L12 1z'
    },
    {
      label: 'Search', active: true,
      path: 'M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'
    },
  ]
  return (
    <div className="flex-shrink-0 flex justify-around items-center py-1.5 pb-3"
      style={{ background: c.tabBar, borderTop: `0.5px solid ${c.border}` }}>
      {tabs.map(tab => (
        <div key={tab.label} className="flex flex-col items-center gap-[2px] min-w-0 px-1">
          <svg viewBox="0 0 24 24" width="22" height="22"
            style={{ fill: tab.active ? '#007AFF' : c.sub }}>
            <path d={tab.path} />
          </svg>
          <span className="text-[8px] font-medium" style={{ color: tab.active ? '#007AFF' : c.sub }}>
            {tab.label}
          </span>
        </div>
      ))}
    </div>
  )
}

function UploadIconZone({ icon, gradient = 'from-indigo-500 to-blue-600', size, borderRadius, onUpload }: {
  icon: string | null
  gradient?: string
  size: number
  borderRadius: string
  onUpload?: (dataUrl: string) => void
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
  src?: string
  index: number
  height: number
  width: number
  borderRadius: string
  c: C
  onUpload?: (index: number, dataUrl: string) => void
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
      style={{ width, height, borderRadius, background: src ? 'transparent' : c.sep, cursor: onUpload ? 'pointer' : 'default' }}
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
            {onUpload && (
              <svg viewBox="0 0 24 24" className="w-4 h-4" style={{ fill: c.sub }}>
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
            )}
            <span className="text-[7px] text-center px-1" style={{ color: c.sub }}>
              {onUpload ? 'Add' : `Screenshot ${index + 1}`}
            </span>
          </div>
        )}
      {onUpload && (
        <input ref={inputRef} type="file" accept="image/*" className="sr-only"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
      )}
    </div>
  )
}

interface AppCardProps {
  icon: string | null
  iconGradient?: string
  name: string
  subtitle: string
  developer: string
  category: string
  rating: number
  reviewCount: string
  screenshots: string[]
  btn: string
  hasIAP?: boolean
  sponsored?: boolean
  c: C
  prefix: string
  onUploadIcon?: (dataUrl: string) => void
  onUploadScreenshot?: (index: number, dataUrl: string) => void
  isUserApp?: boolean
}

function AppCard({ icon, iconGradient = 'from-indigo-500 to-blue-600', name, subtitle, developer, category, rating, reviewCount, screenshots, btn, hasIAP, sponsored, c, prefix, onUploadIcon, onUploadScreenshot, isUserApp }: AppCardProps) {
  const maxShots = 10
  const slots = isUserApp
    ? Math.min(Math.max(screenshots.length + (onUploadScreenshot && screenshots.length < maxShots ? 1 : 0), 3), maxShots)
    : 3

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center gap-3 px-3 pt-3 pb-2">
        <UploadIconZone
          icon={icon}
          gradient={iconGradient}
          size={60}
          borderRadius="13px"
          onUpload={onUploadIcon}
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[14px] leading-tight line-clamp-1" style={{ color: c.text }}>{name}</p>
          <p className="text-[11px] mt-0.5 line-clamp-1" style={{ color: c.sub }}>{subtitle}</p>
          <p className="text-[10px] mt-0.5 line-clamp-1" style={{ color: c.sub }}>{developer}</p>
        </div>
        <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
          <button className="text-[13px] font-semibold px-5 py-[6px] rounded-full min-w-[62px] text-center"
            style={{ background: c.btnBg, color: '#007AFF' }}>
            {btn}
          </button>
          {hasIAP && <span className="text-[7px] text-center leading-tight whitespace-nowrap" style={{ color: c.sub }}>In-App<br />Purchases</span>}
          {sponsored && <span className="text-[7px]" style={{ color: c.sub }}>Sponsored</span>}
        </div>
      </div>

      {/* Rating row */}
      <div className="flex items-center gap-1 px-3 pb-2 flex-wrap">
        <Stars rating={rating} size={9} emptyColor={c.starEmpty} prefix={prefix} />
        <span className="text-[10px]" style={{ color: c.sub }}>{reviewCount}</span>
        <span className="text-[10px] mx-0.5" style={{ color: c.sep }}>·</span>
        <span className="text-[10px] line-clamp-1" style={{ color: c.sub }}>{developer}</span>
        <span className="text-[10px] mx-0.5" style={{ color: c.sep }}>·</span>
        <span className="text-[10px]" style={{ color: c.sub }}>{category}</span>
      </div>

      {/* Screenshots */}
      <div className="px-3 pb-3">
        <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollSnapType: 'x mandatory' }}>
          {Array.from({ length: slots }).map((_, i) => (
            <div key={i} style={{ scrollSnapAlign: 'start' }}>
              <UploadScreenshotSlot
                src={screenshots[i]}
                index={i}
                height={130}
                width={screenshots[i] ? 82 : 74}
                borderRadius="8px"
                c={c}
                onUpload={isUserApp ? onUploadScreenshot : undefined}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const COMPETITORS = [
  { icon: null, iconGradient: 'from-orange-400 to-pink-500', name: 'Notion — Notes & Projects', subtitle: 'Organize Your Work & Life', developer: 'Notion Labs, Inc.', category: 'Productivity', rating: 4.7, reviewCount: '125.4K', btn: 'GET', hasIAP: true, prefix: 'asc1' },
  { icon: null, iconGradient: 'from-sky-400 to-blue-600', name: 'Headspace: Sleep & Meditation', subtitle: 'Mindfulness & Stress Relief', developer: 'Headspace Inc.', category: 'Health & Fitness', rating: 4.9, reviewCount: '890.1K', btn: 'GET', hasIAP: true, prefix: 'asc2' },
]

function SearchView({ data, c, onUploadIcon, onUploadScreenshot }: { data: AppData, c: C, onUploadIcon?: (d: string) => void, onUploadScreenshot?: (i: number, d: string) => void }) {
  const price = formatPrice(data.price)
  const reviews = formatReviews(data.reviewCount)
  const btn = price === 'Free' ? 'GET' : price

  return (
    <div className="h-full flex flex-col" style={{ background: c.bg }}>
      <StatusBar c={c} />

      {/* Search bar — sticky */}
      <div className="flex-shrink-0 px-4 pb-2 flex items-center gap-2" style={{ background: c.bg }}>
        <div className="flex-1 rounded-[10px] px-3 py-[7px] flex items-center gap-2"
          style={{ background: c.searchBg, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" style={{ fill: c.searchText }}>
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <span className="text-[13px]" style={{ color: c.searchText }}>Search</span>
        </div>
        <button className="text-[14px] font-medium flex-shrink-0" style={{ color: '#007AFF' }}>Cancel</button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
        {/* User app */}
        <div className="mx-3 rounded-[12px] overflow-hidden mb-2.5"
          style={{ background: c.card, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <AppCard
            icon={data.iconDataUrl || null}
            name={data.appName || 'App Name'}
            subtitle={data.subtitle || 'App Subtitle'}
            developer={data.developerName || 'Developer'}
            category={data.category || 'App'}
            rating={data.rating}
            reviewCount={reviews + ' Ratings'}
            screenshots={data.screenshots}
            btn={btn}
            hasIAP={data.hasInAppPurchases}
            c={c}
            prefix="asusr"
            onUploadIcon={onUploadIcon}
            onUploadScreenshot={onUploadScreenshot}
            isUserApp
          />
        </div>

        <div className="px-4 pb-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: c.sub }}>
            You might also like
          </p>
        </div>

        {COMPETITORS.map((comp, idx) => (
          <div key={idx} className="mx-3 rounded-[12px] overflow-hidden mb-2.5"
            style={{ background: c.card, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <AppCard {...comp} screenshots={[]} c={c} />
          </div>
        ))}

        <div className="h-2" />
      </div>

      <BottomTabBar c={c} />
    </div>
  )
}

function DetailView({ data, c, onUploadIcon, onUploadScreenshot }: { data: AppData, c: C, onUploadIcon?: (d: string) => void, onUploadScreenshot?: (i: number, d: string) => void }) {
  const price = formatPrice(data.price)
  const rating = formatRating(data.rating)
  const reviews = formatReviews(data.reviewCount)
  const btn = price === 'Free' ? 'GET' : price

  const maxShots = 10
  const slots = Math.min(Math.max(data.screenshots.length + (onUploadScreenshot && data.screenshots.length < maxShots ? 1 : 0), 3), maxShots)

  return (
    <div className="h-full flex flex-col" style={{ background: c.bg }}>
      <StatusBar c={c} />

      {/* Nav */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 pb-2" style={{ background: c.bg }}>
        <button className="flex items-center gap-1 text-[14px]" style={{ color: '#007AFF' }}>
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg>
          Search
        </button>
        <svg viewBox="0 0 24 24" className="w-5 h-5" style={{ fill: '#007AFF' }}>
          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
        </svg>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
        {/* App header */}
        <div className="px-4 pb-4 flex gap-4">
          <UploadIconZone
            icon={data.iconDataUrl || null}
            size={110}
            borderRadius="24px"
            onUpload={onUploadIcon}
          />
          <div className="flex-1 min-w-0 pt-1">
            <h1 className="font-bold text-[18px] leading-tight" style={{ color: c.text }}>
              {data.appName || 'App Name'}
            </h1>
            <p className="text-[13px] mt-1" style={{ color: c.sub }}>{data.subtitle || 'App Subtitle'}</p>
            <p className="text-[12px] mt-0.5 font-medium" style={{ color: '#007AFF' }}>
              {data.developerName || 'Developer'}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <button className="text-[15px] font-semibold px-6 py-[7px] rounded-full"
                style={{ background: c.btnBg, color: '#007AFF' }}>
                {btn}
              </button>
              {data.hasInAppPurchases && <span className="text-[9px]" style={{ color: c.sub }}>In-App Purchases</span>}
            </div>
          </div>
        </div>

        <div className="mx-4 mb-3" style={{ height: '0.5px', background: c.border }} />

        {/* Badges */}
        <div className="flex px-4 pb-3 gap-0">
          {([
            { val: rating, label: 'Rating', extra: <Stars rating={data.rating} size={9} emptyColor={c.starEmpty} prefix="asdt" /> },
            { val: reviews, label: 'Ratings', extra: null },
            { val: data.category || 'Utilities', label: 'Category', extra: null },
          ] as { val: string, label: string, extra: React.ReactNode }[]).map((item, idx, arr) => (
            <div key={idx} className={`flex-1 text-center ${idx < arr.length - 1 ? 'border-r' : ''}`}
              style={{ borderColor: c.border }}>
              <div className="text-[16px] font-semibold" style={{ color: c.text }}>{item.val}</div>
              {item.extra && <div className="flex justify-center mt-0.5">{item.extra}</div>}
              <div className="text-[9px] uppercase tracking-wide mt-0.5" style={{ color: c.sub }}>{item.label}</div>
            </div>
          ))}
        </div>

        <div className="mx-4 mb-3" style={{ height: '0.5px', background: c.border }} />

        {/* Screenshots */}
        <div className="px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollSnapType: 'x mandatory' }}>
            {Array.from({ length: slots }).map((_, i) => (
              <div key={i} style={{ scrollSnapAlign: 'start' }}>
                <UploadScreenshotSlot
                  src={data.screenshots[i]}
                  index={i}
                  height={160}
                  width={data.screenshots[i] ? 98 : 88}
                  borderRadius="12px"
                  c={c}
                  onUpload={onUploadScreenshot}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mx-4 mb-3" style={{ height: '0.5px', background: c.border }} />

        {/* Description */}
        <div className="px-4 pb-4">
          <h2 className="text-[15px] font-semibold mb-2" style={{ color: c.text }}>About</h2>
          <p className="text-[12px] leading-relaxed line-clamp-4" style={{ color: c.sub }}>
            {data.subtitle || "Short description of your app. This section shows your app's long description from the App Store listing."}
          </p>
          <button className="text-[12px] mt-1 font-medium" style={{ color: '#007AFF' }}>more</button>
        </div>

        {/* Ratings widget */}
        <div className="mx-4 rounded-[12px] p-3 mb-4" style={{ background: c.card, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div className="flex items-end gap-3">
            <div className="text-center">
              <div className="text-[42px] font-thin leading-none" style={{ color: c.text }}>{rating}</div>
              <div className="text-[10px] mt-1" style={{ color: c.sub }}>out of 5</div>
            </div>
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map(star => {
                const pct = star === 5 ? 85 : star === 4 ? 10 : star === 3 ? 3 : 1
                return (
                  <div key={star} className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[8px] w-2" style={{ color: c.sub }}>{star}</span>
                    <div className="flex-1 rounded-full h-[3px] overflow-hidden" style={{ background: c.border }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c.sub }} />
                    </div>
                  </div>
                )
              })}
              <div className="text-[9px] mt-1" style={{ color: c.sub }}>{reviews} Ratings</div>
            </div>
          </div>
          <div className="flex justify-center mt-2">
            <Stars rating={data.rating} size={12} emptyColor={c.starEmpty} prefix="asdtb" />
          </div>
        </div>
      </div>

      <BottomTabBar c={c} />
    </div>
  )
}

export function AppStorePreview({ data, dark = false, mode = 'search', onUploadIcon, onUploadScreenshot }: Props) {
  const c = colors(dark)
  return mode === 'search'
    ? <SearchView data={data} c={c} onUploadIcon={onUploadIcon} onUploadScreenshot={onUploadScreenshot} />
    : <DetailView data={data} c={c} onUploadIcon={onUploadIcon} onUploadScreenshot={onUploadScreenshot} />
}
