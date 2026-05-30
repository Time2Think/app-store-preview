import { useRef } from 'react'
import { ArrowLeft, Search, Mic, MoreVertical, Star, ChevronDown, Download, ChevronRight, Gamepad2, AppWindow, BookOpen, User } from 'lucide-react'
import { AppData, PreviewMode, UploadHandlers } from '@/lib/types'
import { formatReviews, formatPrice } from '@/lib/formatters'
import { androidTokens, AndroidTokens, Theme } from '@/lib/androidTokens'

interface Props extends UploadHandlers {
  data: AppData
  dark?: boolean
  mode?: PreviewMode
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

function StatusBar({ t }: { t: AndroidTokens }) {
  return (
    <div className="flex justify-between items-center flex-shrink-0 relative z-10"
      style={{ color: t.onSurface, height: '40px', padding: '0 20px' }}>
      <span style={{ fontSize: '13px', fontWeight: 500 }}>9:41</span>
      <div className="flex items-center gap-[5px]">
        <svg viewBox="0 0 18 12" width="15" height="11" className="fill-current">
          <rect x="0" y="8" width="3" height="4" rx="0.5"/>
          <rect x="4" y="6" width="3" height="6" rx="0.5"/>
          <rect x="8" y="3" width="3" height="9" rx="0.5"/>
          <rect x="12" y="0" width="3" height="12" rx="0.5"/>
        </svg>
        <svg viewBox="0 0 16 12" width="14" height="11" className="fill-current">
          <path d="M8 11.5l1.5-1.5c-.83-.83-2.17-.83-3 0L8 11.5zm-3-3l1.5 1.5c.83-.83 2.17-.83 3 0L11 8.5c-1.66-1.66-4.34-1.66-6 0zM2 5.5l1.5 1.5c2.5-2.5 6.5-2.5 9 0L14 5.5C10.69 2.19 5.31 2.19 2 5.5z"/>
        </svg>
        <svg viewBox="0 0 26 12" width="24" height="11">
          <rect x="0.5" y="0.5" width="22" height="11" rx="3" fill="none" stroke="currentColor" strokeOpacity="0.4"/>
          <rect x="2" y="2" width="19" height="8" rx="1.5" fill="currentColor"/>
          <rect x="23.5" y="4" width="1.5" height="4" rx="0.5" fill="currentColor" fillOpacity="0.4"/>
        </svg>
      </div>
    </div>
  )
}

const GP_TABS = [
  { label: 'Games', icon: Gamepad2, active: false },
  { label: 'Apps', icon: AppWindow, active: false },
  { label: 'Search', icon: Search, active: true },
  { label: 'Books', icon: BookOpen, active: false },
  { label: 'You', icon: User, active: false },
]

function BottomNav({ t }: { t: AndroidTokens }) {
  return (
    <div className="flex-shrink-0 flex justify-around items-center pt-1.5 pb-2"
      style={{ background: t.navBg, borderTop: `1px solid ${t.outlineVariant}` }}>
      {GP_TABS.map(tab => {
        const Icon = tab.icon
        return (
          <div key={tab.label} className="flex flex-col items-center gap-0.5">
            <div className="px-5 py-1 rounded-full flex items-center justify-center"
              style={{ background: tab.active ? t.primaryContainer : 'transparent' }}>
              <Icon className="w-6 h-6" style={{ color: tab.active ? t.primary : t.onSurfaceVariant }} strokeWidth={tab.active ? 2.5 : 1.8} />
            </div>
            <span className="font-medium" style={{ color: tab.active ? t.primary : t.onSurfaceVariant, fontSize: '11px' }}>
              {tab.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function UploadIconZone({ icon, size, borderRadius, gradient = 'from-pink-500 via-purple-500 to-indigo-500', onUpload }: {
  icon: string | null
  size: number
  borderRadius: string
  gradient?: string
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
          <span className="text-[9px] text-white/85 bg-black/30 px-1.5 py-0.5 rounded-full">tap to upload</span>
        </div>
      )}
      {onUpload && (
        <input ref={inputRef} type="file" accept="image/*" className="sr-only"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
      )}
    </div>
  )
}

function UploadScreenshotSlot({ src, index, height, width, borderRadius, t, onUpload, isLandscape }: {
  src?: string
  index: number
  height: number
  width: number
  borderRadius: string
  t: AndroidTokens
  onUpload?: (index: number, dataUrl: string) => void
  isLandscape?: boolean
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
      style={{
        width: isLandscape ? height : width,
        height: isLandscape ? width : height,
        borderRadius,
        background: src ? 'transparent' : t.surfaceContainer,
        cursor: onUpload ? 'pointer' : 'default',
      }}
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
              <svg viewBox="0 0 24 24" className="w-5 h-5" style={{ fill: t.onSurfaceVariant }}>
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
            )}
            <span className="text-[10px] text-center px-1" style={{ color: t.onSurfaceVariant }}>
              {onUpload ? 'Add' : `${index + 1}`}
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

const GP_COMPETITORS = [
  {
    renderIcon: () => (
      <svg viewBox="0 0 60 60" className="w-full h-full">
        <rect width="60" height="60" rx="14" fill="#58CC02"/>
        <circle cx="30" cy="28" r="14" fill="white"/>
        <circle cx="25" cy="24" r="3" fill="#1CB0F6"/>
        <circle cx="35" cy="24" r="3" fill="#1CB0F6"/>
        <circle cx="25" cy="24" r="1.5" fill="#000"/>
        <circle cx="35" cy="24" r="1.5" fill="#000"/>
        <ellipse cx="30" cy="34" rx="5" ry="3" fill="#FFB833"/>
      </svg>
    ),
    name: 'Duolingo: Language Lessons',
    devCategory: 'Duolingo · Education',
    tagline: 'Learn a new language for free',
    rating: 4.7, size: '68 MB', downloads: '500M+',
  },
  {
    renderIcon: () => (
      <svg viewBox="0 0 60 60" className="w-full h-full">
        <rect width="60" height="60" rx="14" fill="#000000"/>
        <g fill="#1ED760">
          <rect x="14" y="20" width="3" height="20" rx="1"/>
          <rect x="20" y="14" width="3" height="32" rx="1"/>
          <rect x="26" y="18" width="3" height="24" rx="1"/>
          <rect x="32" y="12" width="3" height="36" rx="1"/>
          <rect x="38" y="22" width="3" height="16" rx="1"/>
          <rect x="44" y="16" width="3" height="28" rx="1"/>
        </g>
      </svg>
    ),
    name: 'Spotify: Music & Podcasts',
    devCategory: 'Spotify AB · Music & Audio',
    tagline: 'Your AI Dance Video Awaits',
    rating: 4.5, size: '52 MB', downloads: '1B+',
  },
]

function FilterChip({ label, active, dropdown, t }: { label: string, active?: boolean, dropdown?: boolean, t: AndroidTokens }) {
  return (
    <button
      className="flex-shrink-0 flex items-center gap-1 px-3 rounded-lg whitespace-nowrap"
      style={{
        background: active ? t.primaryContainer : 'transparent',
        border: active ? 'none' : `1px solid ${t.outline}`,
        color: active ? t.onPrimaryContainer : t.onSurface,
        fontSize: '13px',
        height: '32px',
        fontWeight: 500,
      }}>
      {label}
      {dropdown && <ChevronDown className="w-3.5 h-3.5" strokeWidth={2}/>}
    </button>
  )
}

function SearchListRow({
  renderIcon, name, devCategory, tagline, rating, size, downloads, t,
}: {
  renderIcon: () => React.ReactNode
  name: string
  devCategory: string
  tagline?: string
  rating: number
  size: string
  downloads: string
  t: AndroidTokens
}) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div className="flex-shrink-0 overflow-hidden" style={{ width: 56, height: 56, borderRadius: '14px' }}>
        {renderIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium leading-tight" style={{ color: t.onSurface, fontSize: '15px' }}>{name}</p>
        <p className="mt-0.5 line-clamp-1" style={{ color: t.onSurfaceVariant, fontSize: '12px' }}>{devCategory}</p>
        {tagline && <p className="mt-0.5 italic line-clamp-1" style={{ color: t.onSurfaceVariant, fontSize: '12px' }}>{tagline}</p>}
        <div className="flex items-center gap-2.5 mt-1.5">
          <div className="flex items-center gap-0.5">
            <span style={{ color: t.onSurface, fontSize: '12px' }}>{rating.toFixed(1)}</span>
            <Star className="w-2.5 h-2.5" style={{ fill: t.primary, color: t.primary }} />
          </div>
          <span style={{ color: t.onSurfaceVariant, fontSize: '12px' }}>{size}</span>
          <div className="flex items-center gap-0.5">
            <Download className="w-2.5 h-2.5" style={{ color: t.primary }} strokeWidth={2.5}/>
            <span style={{ color: t.onSurfaceVariant, fontSize: '12px' }}>{downloads}</span>
          </div>
        </div>
      </div>
      <button className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0"
        style={{ background: t.surfaceContainer }}>
        <ChevronDown className="w-4 h-4" style={{ color: t.onSurfaceVariant }} />
      </button>
    </div>
  )
}

function UserAppSearchRow({ data, t, onUploadIcon }: {
  data: AppData, t: AndroidTokens, onUploadIcon?: (dataUrl: string) => void
}) {
  const rating = data.rating.toFixed(1)
  const reviews = formatReviews(data.reviewCount)
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <UploadIconZone icon={data.iconDataUrl || null} size={56} borderRadius="14px" onUpload={onUploadIcon} />
      <div className="flex-1 min-w-0">
        <p className="font-medium leading-tight" style={{ color: t.onSurface, fontSize: '15px' }}>{data.appName || 'App Name'}</p>
        <p className="mt-0.5 line-clamp-1" style={{ color: t.onSurfaceVariant, fontSize: '12px' }}>
          {data.developerName || 'Developer'} · {data.category || 'Utilities'}
        </p>
        <p className="mt-0.5 italic line-clamp-1" style={{ color: t.onSurfaceVariant, fontSize: '12px' }}>{data.subtitle || 'App Subtitle'}</p>
        <div className="flex items-center gap-2.5 mt-1.5">
          <div className="flex items-center gap-0.5">
            <span style={{ color: t.onSurface, fontSize: '12px' }}>{rating}</span>
            <Star className="w-2.5 h-2.5" style={{ fill: t.primary, color: t.primary }} />
          </div>
          <span style={{ color: t.onSurfaceVariant, fontSize: '12px' }}>{reviews}</span>
          <span style={{ color: t.onSurfaceVariant, fontSize: '12px' }}>{data.category || 'Utilities'}</span>
        </div>
      </div>
      <button className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0"
        style={{ background: t.surfaceContainer }}>
        <ChevronDown className="w-4 h-4" style={{ color: t.onSurfaceVariant }} />
      </button>
    </div>
  )
}

function SearchView({ data, t, onUploadIcon }: {
  data: AppData, t: AndroidTokens, onUploadIcon?: (d: string) => void
}) {
  return (
    <div className="h-full flex flex-col" style={{ background: t.surface, fontFamily: 'var(--font-android), Roboto, sans-serif' }}>
      <StatusBar t={t} />

      {/* Title bar */}
      <div className="flex-shrink-0 flex items-center gap-3 px-3 py-2" style={{ background: t.surface }}>
        <button className="w-10 h-10 flex items-center justify-center rounded-full">
          <ArrowLeft className="w-5 h-5" style={{ color: t.onSurface }} strokeWidth={2}/>
        </button>
        <span className="flex-1" style={{ color: t.onSurface, fontSize: '18px', fontWeight: 400 }}>Animation apps</span>
        <button className="w-10 h-10 flex items-center justify-center rounded-full">
          <Search className="w-5 h-5" style={{ color: t.onSurface }} strokeWidth={2}/>
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full">
          <Mic className="w-5 h-5" style={{ color: t.onSurface }} strokeWidth={2}/>
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex-shrink-0 flex gap-2 px-3 pb-2 overflow-x-auto [&::-webkit-scrollbar]:hidden"
        style={{ background: t.surface }}>
        <FilterChip label="Rating" t={t} dropdown />
        <FilterChip label="Family" t={t} />
        <FilterChip label="Premium" t={t} />
        <FilterChip label="New" t={t} />
        <FilterChip label="Editor" t={t} />
      </div>

      {/* Sponsored header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1" style={{ background: t.surface }}>
        <span className="font-semibold" style={{ color: t.onSurfaceVariant, fontSize: '12px' }}>Sponsored</span>
        <MoreVertical className="w-4 h-4" style={{ color: t.onSurfaceVariant }} />
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
        <UserAppSearchRow data={data} t={t} onUploadIcon={onUploadIcon} />
        <div style={{ height: '0.5px', background: t.outlineVariant, margin: '0 16px' }} />
        {GP_COMPETITORS.map((comp, idx) => (
          <SearchListRow
            key={idx}
            renderIcon={comp.renderIcon}
            name={comp.name}
            devCategory={comp.devCategory}
            tagline={comp.tagline}
            rating={comp.rating}
            size={comp.size}
            downloads={comp.downloads}
            t={t}
          />
        ))}
        <div className="h-2" />
      </div>

      <BottomNav t={t} />
    </div>
  )
}

function DetailView({ data, t, onUploadIcon, onUploadScreenshot }: {
  data: AppData, t: AndroidTokens, onUploadIcon?: (d: string) => void, onUploadScreenshot?: (i: number, d: string) => void
}) {
  const price = formatPrice(data.price)
  const reviews = formatReviews(data.reviewCount)
  const rating = data.rating.toFixed(1)
  const btn = price === 'Free' ? 'Install' : price

  const maxShots = 10
  const slots = Math.min(Math.max(data.screenshots.length + (onUploadScreenshot && data.screenshots.length < maxShots ? 1 : 0), 3), maxShots)

  return (
    <div className="h-full flex flex-col" style={{ background: t.surface, fontFamily: 'var(--font-android), Roboto, sans-serif' }}>
      <StatusBar t={t} />

      {/* Top nav */}
      <div className="flex-shrink-0 flex items-center justify-between px-2 py-1" style={{ background: t.surface }}>
        <button className="w-10 h-10 flex items-center justify-center rounded-full">
          <ArrowLeft className="w-5 h-5" style={{ color: t.onSurface }} strokeWidth={2}/>
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full">
          <MoreVertical className="w-5 h-5" style={{ color: t.onSurface }} strokeWidth={2}/>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
        {/* App header */}
        <div className="px-4 pb-4 flex gap-4" style={{ background: t.surface }}>
          <UploadIconZone icon={data.iconDataUrl || null} size={72} borderRadius="16px" onUpload={onUploadIcon} />
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h1 className="font-medium leading-tight" style={{ color: t.onSurface, fontSize: '22px' }}>
              {data.appName || 'App Name'}
            </h1>
            <p className="mt-1 font-medium line-clamp-1" style={{ color: t.primary, fontSize: '14px' }}>
              {data.developerName || 'Developer'}
            </p>
            {data.hasInAppPurchases && (
              <p className="mt-0.5" style={{ color: t.onSurfaceVariant, fontSize: '12px' }}>Contains ads · In-app purchases</p>
            )}
          </div>
        </div>

        {/* Badges row */}
        <div className="flex items-center px-4 pb-3" style={{ background: t.surface }}>
          {([
            {
              big: <div className="flex items-center gap-1">
                <span className="font-semibold" style={{ color: t.onSurface, fontSize: '15px' }}>{rating}</span>
                <Star className="w-3 h-3" style={{ fill: t.onSurface, color: t.onSurface }} />
              </div>,
              sub: `${reviews} reviews`,
            },
            {
              big: <div className="rounded border px-1.5 font-semibold" style={{ borderColor: t.outline, color: t.onSurface, fontSize: '11px', lineHeight: '14px' }}>3+</div>,
              sub: 'Rated for 3+',
            },
            {
              big: <Download className="w-4 h-4" style={{ color: t.onSurface }} strokeWidth={2}/>,
              sub: '96 MB',
            },
            {
              big: <span className="font-semibold" style={{ color: t.onSurface, fontSize: '15px' }}>{data.reviewCount > 0 ? formatReviews(Math.round(data.reviewCount * 100)) : '10M+'}</span>,
              sub: 'Downloads',
            },
          ] as { big: React.ReactNode, sub: string }[]).map((item, idx, arr) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1"
              style={{ borderRight: idx < arr.length - 1 ? `1px solid ${t.outlineVariant}` : 'none' }}>
              <div className="flex items-center justify-center" style={{ minHeight: '20px' }}>{item.big}</div>
              <span style={{ color: t.onSurfaceVariant, fontSize: '11px' }}>{item.sub}</span>
            </div>
          ))}
        </div>

        {/* Install button */}
        <div className="px-4 pb-4" style={{ background: t.surface }}>
          <button
            className="w-full rounded-lg font-medium"
            style={{ background: t.primary, color: t.onPrimary, height: '40px', fontSize: '15px' }}>
            {btn}
          </button>
        </div>

        {/* Screenshots — landscape */}
        <div className="pb-4" style={{ background: t.surface }}>
          <DragScrollX className="px-4 gap-3">
            {Array.from({ length: slots }).map((_, i) => (
              <UploadScreenshotSlot
                key={i}
                src={data.screenshots[i]}
                index={i}
                height={200}
                width={120}
                borderRadius="8px"
                t={t}
                onUpload={onUploadScreenshot}
              />
            ))}
          </DragScrollX>
        </div>

        {/* About this app */}
        <div className="px-4 py-3 flex items-center justify-between" style={{ background: t.surface }}>
          <h2 className="font-medium" style={{ color: t.onSurface, fontSize: '20px' }}>About this app</h2>
          <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: t.surfaceContainer }}>
            <ChevronRight className="w-5 h-5" style={{ color: t.onSurface }} />
          </button>
        </div>

        <div className="px-4 pb-3" style={{ background: t.surface }}>
          <p className="leading-relaxed line-clamp-3" style={{ color: t.onSurface, fontSize: '14px' }}>
            {data.subtitle || 'Make your own Animations, Video and Photo Edits, Visual Effects, and more!'}
          </p>
        </div>

        {/* Top badge + category chip */}
        <div className="px-4 pb-3 flex flex-wrap gap-2" style={{ background: t.surface }}>
          <div className="px-3 py-1.5 rounded-full" style={{ border: `1px solid ${t.outline}`, color: t.onSurface, fontSize: '13px' }}>
            #8 top grossing in {data.category?.toLowerCase() || 'video players'}
          </div>
          <div className="px-3 py-1.5 rounded-full" style={{ border: `1px solid ${t.outline}`, color: t.onSurface, fontSize: '13px' }}>
            {data.category || 'Editor'}
          </div>
        </div>

        <div className="h-6" />
      </div>

      <BottomNav t={t} />
    </div>
  )
}

export function GooglePlayPreview({ data, dark = false, mode = 'search', onUploadIcon, onUploadScreenshot }: Props) {
  const theme: Theme = dark ? 'dark' : 'light'
  const t = androidTokens(theme)
  return mode === 'search'
    ? <SearchView data={data} t={t} onUploadIcon={onUploadIcon} />
    : <DetailView data={data} t={t} onUploadIcon={onUploadIcon} onUploadScreenshot={onUploadScreenshot} />
}
