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
    btnBg: '#E5F0FF',
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

const AS_TABS = [
  { label: 'Today',
    path: 'M6 2h12l2 4H4L6 2zm-2 5h16v13H4V7zm3 2v2h2V9H7zm0 4v2h2v-2H7zm4-4v2h2V9h-2zm0 4v2h2v-2h-2zm4-4v2h2V9h-2z',
    active: false },
  { label: 'Games',
    path: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1 14H9v-2H7v-2h2v-2h2v2h2v2h-2v2zm6-6h-2v2h-2v-2h2V8h2v2z',
    active: false },
  { label: 'Apps',
    path: 'M4 4h5v5H4zm0 6h5v5H4zm6-6h5v5h-5zm0 6h5v5h-5zm6-6h4v5h-4zm0 6h4v5h-4z',
    active: false },
  { label: 'Arcade',
    path: 'M12 2L9.5 8.5H2l6.2 4.5L5.7 20 12 15.5 18.3 20l-2.5-7L22 8.5h-7.5L12 2z',
    active: false },
  { label: 'Search',
    path: 'M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
    active: true },
]

function BottomTabBar({ c }: { c: C }) {
  return (
    <div className="flex-shrink-0 flex justify-around items-center py-1.5 pb-4 border-t-[0.5px]"
      style={{ background: c.tabBar, borderColor: c.border }}>
      {AS_TABS.map(tab => (
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

const AS_COMPETITORS = [
  {
    renderIcon: () => (
      <svg viewBox="0 0 60 60" className="w-full h-full">
        <rect width="60" height="60" rx="12" fill="#FAFAFA"/>
        <text x="8" y="48" fontSize="46" fontFamily="Georgia,serif" fontWeight="900" fill="#1C1C1E">N</text>
      </svg>
    ),
    name: 'Notion — Notes & Projects', subtitle: 'Organize Your Work & Life',
    developer: 'Notion Labs, Inc.', category: 'Productivity',
    rating: 4.7, reviewCount: '125.4K', hasIAP: true, prefix: 'asc1',
  },
  {
    renderIcon: () => (
      <svg viewBox="0 0 60 60" className="w-full h-full">
        <rect width="60" height="60" rx="12" fill="#FC7041"/>
        <circle cx="30" cy="26" r="16" fill="white"/>
        <circle cx="24" cy="23" r="2.5" fill="#FC7041"/>
        <circle cx="36" cy="23" r="2.5" fill="#FC7041"/>
        <path d="M23 30 Q30 37 37 30" stroke="#FC7041" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      </svg>
    ),
    name: 'Headspace: Meditation', subtitle: 'Mindfulness & Sleep Sounds',
    developer: 'Headspace Inc.', category: 'Health & Fitness',
    rating: 4.9, reviewCount: '890.1K', hasIAP: true, prefix: 'asc2',
  },
]

interface SearchCardProps {
  renderIcon: () => React.ReactNode
  name: string
  subtitle: string
  developer: string
  category: string
  rating: number
  reviewCount: string
  hasIAP?: boolean
  c: C
  prefix: string
  screenshots?: string[]
  isUserApp?: boolean
  onUploadIcon?: (dataUrl: string) => void
  onUploadScreenshot?: (index: number, dataUrl: string) => void
  userIcon?: string | null
}

function SearchAppCard({
  renderIcon, name, subtitle, developer, category, rating, reviewCount, hasIAP, c, prefix,
  screenshots = [], isUserApp, onUploadIcon, onUploadScreenshot, userIcon,
}: SearchCardProps) {
  const maxShots = 10
  const slots = isUserApp
    ? Math.min(Math.max(screenshots.length + (onUploadScreenshot && screenshots.length < maxShots ? 1 : 0), 3), maxShots)
    : 3

  return (
    <div>
      {/* Row 1: icon + name/subtitle + GET button */}
      <div className="flex items-center gap-3 px-4 py-3 pb-1">
        {isUserApp ? (
          <UploadIconZone
            icon={userIcon ?? null}
            size={60}
            borderRadius="13px"
            onUpload={onUploadIcon}
          />
        ) : (
          <div className="w-[60px] h-[60px] flex-shrink-0 overflow-hidden" style={{ borderRadius: '13px' }}>
            {renderIcon()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[14px] leading-tight line-clamp-1" style={{ color: c.text }}>{name}</p>
          <p className="text-[11px] mt-0.5 line-clamp-1" style={{ color: c.sub }}>{subtitle}</p>
          {hasIAP && (
            <span className="text-[9px] mt-0.5 inline-block" style={{ color: c.sub }}>In-App Purchases</span>
          )}
        </div>
        <button className="text-[13px] font-semibold px-4 py-[5px] rounded-full flex-shrink-0"
          style={{ background: c.btnBg, color: '#007AFF', minWidth: '56px', textAlign: 'center' }}>
          GET
        </button>
      </div>

      {/* Row 2: stars · developer · category */}
      <div className="flex items-center gap-1 px-4 pb-2">
        <Stars rating={rating} size={9} emptyColor={c.starEmpty} prefix={prefix} />
        <span className="text-[9px]" style={{ color: c.sub }}>{reviewCount}</span>
        <span className="text-[9px] mx-0.5" style={{ color: c.sep }}>·</span>
        <svg viewBox="0 0 24 24" width="9" height="9" style={{ fill: c.sub, flexShrink: 0 }}>
          <path d="M12 12c2.7 0 4-1.3 4-4s-1.3-4-4-4-4 1.3-4 4 1.3 4 4 4zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z"/>
        </svg>
        <span className="text-[9px] line-clamp-1" style={{ color: c.sub }}>{developer}</span>
        <span className="text-[9px] mx-0.5" style={{ color: c.sep }}>·</span>
        <svg viewBox="0 0 24 24" width="9" height="9" style={{ fill: c.sub, flexShrink: 0 }}>
          <path d="M4 4h4v4H4zm5 0h4v4H9zm5 0h4v4h-4zM4 9h4v4H4zm5 0h4v4H9zm5 0h4v4h-4z"/>
        </svg>
        <span className="text-[9px]" style={{ color: c.sub }}>{category}</span>
      </div>

      {/* Row 3: screenshots */}
      <DragScrollX className="px-4 pb-3 gap-2">
        {Array.from({ length: slots }).map((_, i) => (
          isUserApp ? (
            <UploadScreenshotSlot
              key={i}
              src={screenshots[i]}
              index={i}
              height={160}
              width={screenshots[i] ? 88 : 80}
              borderRadius="8px"
              c={c}
              onUpload={onUploadScreenshot}
            />
          ) : (
            <div key={i} className="flex-shrink-0 rounded-[8px]"
              style={{ width: 80, height: 160, background: c.sep }} />
          )
        ))}
      </DragScrollX>
    </div>
  )
}

function SearchView({ data, c, onUploadIcon, onUploadScreenshot }: {
  data: AppData, c: C, onUploadIcon?: (d: string) => void, onUploadScreenshot?: (i: number, d: string) => void
}) {
  const price = formatPrice(data.price)
  const reviews = formatReviews(data.reviewCount)
  const btn = price === 'Free' ? 'GET' : price

  return (
    <div className="h-full flex flex-col" style={{ background: c.bg }}>
      <StatusBar c={c} />

      {/* Search bar sticky */}
      <div className="flex-shrink-0 px-4 pb-2 flex items-center gap-2" style={{ background: c.bg }}>
        <div className="flex-1 rounded-[10px] px-3 py-[7px] flex items-center gap-2"
          style={{ background: c.searchBg, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] flex-shrink-0" style={{ fill: c.searchText }}>
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <span className="text-[13px]" style={{ color: c.searchText }}>Search</span>
        </div>
        <button className="text-[14px] font-medium flex-shrink-0" style={{ color: '#007AFF' }}>Cancel</button>
      </div>

      {/* Related search chips sticky */}
      <div className="flex-shrink-0 flex gap-2 px-4 pb-2 overflow-x-auto [&::-webkit-scrollbar]:hidden"
        style={{ background: c.bg }}>
        {['Puzzle', 'Arcade', 'Strategy', 'Word', 'Casual'].map(chip => (
          <div key={chip}
            className="flex-shrink-0 px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap"
            style={{ border: `1px solid ${c.sep}`, color: c.sub, background: 'transparent' }}>
            {chip}
          </div>
        ))}
      </div>

      {/* Scrollable cards */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
        {/* User app card — flat, hairline separator below */}
        <div style={{ background: c.card }}>
          <SearchAppCard
            renderIcon={() => null}
            name={data.appName || 'App Name'}
            subtitle={data.subtitle || 'App Subtitle'}
            developer={data.developerName || 'Developer'}
            category={data.category || 'App'}
            rating={data.rating}
            reviewCount={reviews}
            hasIAP={data.hasInAppPurchases}
            c={c}
            prefix="asusr"
            screenshots={data.screenshots}
            isUserApp
            onUploadIcon={onUploadIcon}
            onUploadScreenshot={onUploadScreenshot}
            userIcon={data.iconDataUrl || null}
          />
        </div>

        {/* "You might also like" separator */}
        <div className="px-4 py-2" style={{ borderTop: `0.5px solid ${c.border}` }}>
          <p className="text-[11px] font-semibold" style={{ color: c.sub }}>You might also like</p>
        </div>

        {/* Competitor cards */}
        {AS_COMPETITORS.map((comp, idx) => (
          <div key={idx} style={{ background: c.card, borderTop: idx === 0 ? 'none' : `0.5px solid ${c.border}` }}>
            <SearchAppCard
              renderIcon={comp.renderIcon}
              name={comp.name}
              subtitle={comp.subtitle}
              developer={comp.developer}
              category={comp.category}
              rating={comp.rating}
              reviewCount={comp.reviewCount}
              hasIAP={comp.hasIAP}
              c={c}
              prefix={comp.prefix}
              isUserApp={false}
            />
            {idx < AS_COMPETITORS.length - 1 && (
              <div style={{ height: '0.5px', background: c.border, margin: '0 16px' }} />
            )}
          </div>
        ))}

        <div className="h-2" />
      </div>

      <BottomTabBar c={c} />
    </div>
  )
}

function DetailView({ data, c, onUploadIcon, onUploadScreenshot }: {
  data: AppData, c: C, onUploadIcon?: (d: string) => void, onUploadScreenshot?: (i: number, d: string) => void
}) {
  const price = formatPrice(data.price)
  const rating = formatRating(data.rating)
  const reviews = formatReviews(data.reviewCount)
  const btn = price === 'Free' ? 'GET' : price

  const maxShots = 10
  const slots = Math.min(Math.max(data.screenshots.length + (onUploadScreenshot && data.screenshots.length < maxShots ? 1 : 0), 3), maxShots)

  return (
    <div className="h-full flex flex-col" style={{ background: c.bg }}>
      <StatusBar c={c} />

      {/* Nav row */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 pb-2" style={{ background: c.bg }}>
        <button className="flex items-center gap-0.5 text-[15px]" style={{ color: '#007AFF' }}>
          <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </button>
        <svg viewBox="0 0 24 24" className="w-5 h-5" style={{ fill: '#007AFF' }}>
          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
        </svg>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
        {/* App header */}
        <div className="px-4 pb-4 flex gap-4" style={{ background: c.card }}>
          <UploadIconZone
            icon={data.iconDataUrl || null}
            size={100}
            borderRadius="22px"
            onUpload={onUploadIcon}
          />
          <div className="flex-1 min-w-0 pt-1">
            <h1 className="font-bold leading-tight" style={{ color: c.text, fontSize: '17px' }}>
              {data.appName || 'App Name'}
            </h1>
            <p className="text-[13px] mt-0.5 line-clamp-1" style={{ color: c.sub }}>
              {data.subtitle || 'App Subtitle'}
            </p>
            <p className="text-[12px] mt-0.5 font-medium" style={{ color: '#007AFF' }}>
              {data.developerName || 'Developer'}
            </p>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <button
                className="text-[14px] font-semibold rounded-full text-center"
                style={{ background: '#007AFF', color: '#fff', minWidth: '62px', height: '28px', padding: '0 16px' }}>
                {btn}
              </button>
              {data.hasInAppPurchases && (
                <span className="text-[9px]" style={{ color: c.sub }}>In-App Purchases</span>
              )}
            </div>
          </div>
        </div>

        <div style={{ height: '0.5px', background: c.border }} />

        {/* Badges row — 4 columns */}
        <div className="flex" style={{ background: c.card }}>
          {([
            {
              top: rating,
              middle: <Stars rating={data.rating} size={9} emptyColor={c.starEmpty} prefix="asdt" />,
              label: `${formatReviews(data.reviewCount)} Ratings`,
            },
            {
              top: '4+',
              middle: null,
              label: 'Age Rating',
            },
            {
              top: (
                <svg viewBox="0 0 24 24" width="18" height="18" style={{ fill: c.sub }}>
                  <path d="M4 4h5v5H4zm0 6h5v5H4zm6-6h5v5h-5zm0 6h5v5h-5zm6-6h4v5h-4zm0 6h4v5h-4z"/>
                </svg>
              ),
              middle: <span className="text-[11px] font-medium line-clamp-1" style={{ color: c.text }}>{data.category || 'Utilities'}</span>,
              label: 'Category',
            },
            {
              top: (
                <svg viewBox="0 0 24 24" width="18" height="18" style={{ fill: c.sub }}>
                  <path d="M12 12c2.7 0 4-1.3 4-4s-1.3-4-4-4-4 1.3-4 4 1.3 4 4 4zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z"/>
                </svg>
              ),
              middle: <span className="text-[11px] font-medium line-clamp-1" style={{ color: c.text }}>{data.developerName || 'Developer'}</span>,
              label: 'Developer',
            },
          ] as { top: React.ReactNode, middle: React.ReactNode, label: string }[]).map((item, idx, arr) => (
            <div key={idx}
              className="flex-1 flex flex-col items-center py-3 px-1 text-center"
              style={{ borderRight: idx < arr.length - 1 ? `0.5px solid ${c.border}` : 'none' }}>
              {typeof item.top === 'string'
                ? <div className="text-[18px] font-bold leading-tight" style={{ color: c.text }}>{item.top}</div>
                : <div className="flex justify-center">{item.top}</div>
              }
              {item.middle && <div className="mt-0.5 flex justify-center w-full px-1">{item.middle}</div>}
              <div className="text-[8px] uppercase tracking-wide mt-0.5" style={{ color: c.sub }}>{item.label}</div>
            </div>
          ))}
        </div>

        <div style={{ height: '0.5px', background: c.border }} />

        {/* Screenshots */}
        <div className="py-3" style={{ background: c.card }}>
          <DragScrollX className="px-4 gap-3">
            {Array.from({ length: slots }).map((_, i) => (
              <UploadScreenshotSlot
                key={i}
                src={data.screenshots[i]}
                index={i}
                height={210}
                width={data.screenshots[i] ? 115 : 105}
                borderRadius="12px"
                c={c}
                onUpload={onUploadScreenshot}
              />
            ))}
          </DragScrollX>
        </div>

        <div style={{ height: '0.5px', background: c.border }} />

        {/* Description */}
        <div className="px-4 py-3" style={{ background: c.card }}>
          <p className="text-[12px] leading-relaxed line-clamp-3" style={{ color: c.text }}>
            {data.subtitle || 'Short description of your app. This section shows your app\'s long description from the App Store listing.'}
          </p>
          <button className="text-[12px] mt-1 font-medium" style={{ color: '#007AFF' }}>more</button>
        </div>

        <div style={{ height: '8px', background: c.bg }} />

        {/* Ratings widget */}
        <div className="px-4 py-3" style={{ background: c.card }}>
          <h2 className="text-[15px] font-semibold mb-2" style={{ color: c.text }}>Ratings &amp; Reviews</h2>
          <div className="flex items-end gap-3">
            <div className="text-center">
              <div className="text-[42px] font-thin leading-none" style={{ color: c.text }}>{rating}</div>
              <div className="flex justify-center mt-1">
                <Stars rating={data.rating} size={10} emptyColor={c.starEmpty} prefix="asdtb" />
              </div>
              <div className="text-[9px] mt-1" style={{ color: c.sub }}>out of 5</div>
            </div>
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map(star => {
                const pct = star === 5 ? 85 : star === 4 ? 10 : star === 3 ? 3 : 1
                return (
                  <div key={star} className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[8px] w-2 text-right" style={{ color: c.sub }}>{star}</span>
                    <div className="flex-1 rounded-full h-[3px] overflow-hidden" style={{ background: c.border }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: '#FF9500' }} />
                    </div>
                  </div>
                )
              })}
              <div className="text-[9px] mt-1" style={{ color: c.sub }}>{formatReviews(data.reviewCount)} Ratings</div>
            </div>
          </div>
        </div>

        <div className="h-4" />
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
