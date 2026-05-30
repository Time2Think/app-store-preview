import { useRef } from 'react'
import { ChevronLeft, Share, X, Search, User, Grid3X3 } from 'lucide-react'
import { AppData, PreviewMode, UploadHandlers } from '@/lib/types'
import { formatReviews, formatRating, formatPrice } from '@/lib/formatters'
import { iosTokens, IOSTokens, Theme } from '@/lib/iosTokens'

interface Props extends UploadHandlers {
  data: AppData
  dark?: boolean
  mode?: PreviewMode
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

function StatusBar({ t }: { t: IOSTokens }) {
  return (
    <div className="flex justify-between items-center flex-shrink-0 relative z-10"
      style={{ color: t.label, height: '48px', padding: '0 28px' }}>
      <span style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.3px' }}>9:41</span>
      <div className="flex items-center gap-[5px]">
        <svg viewBox="0 0 18 12" width="17" height="11" className="fill-current">
          <rect x="0" y="8" width="3" height="4" rx="0.5"/>
          <rect x="4" y="6" width="3" height="6" rx="0.5"/>
          <rect x="8" y="3" width="3" height="9" rx="0.5"/>
          <rect x="12" y="0" width="3" height="12" rx="0.5"/>
        </svg>
        <svg viewBox="0 0 16 12" width="15" height="11" className="fill-current">
          <path d="M8 11.5l1.5-1.5c-.83-.83-2.17-.83-3 0L8 11.5zm-3-3l1.5 1.5c.83-.83 2.17-.83 3 0L11 8.5c-1.66-1.66-4.34-1.66-6 0zM2 5.5l1.5 1.5c2.5-2.5 6.5-2.5 9 0L14 5.5C10.69 2.19 5.31 2.19 2 5.5z"/>
        </svg>
        <svg viewBox="0 0 26 12" width="26" height="11">
          <rect x="0.5" y="0.5" width="22" height="11" rx="3" fill="none" stroke="currentColor" strokeOpacity="0.4"/>
          <rect x="2" y="2" width="19" height="8" rx="1.5" fill="currentColor"/>
          <rect x="23.5" y="4" width="1.5" height="4" rx="0.5" fill="currentColor" fillOpacity="0.4"/>
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

function BottomTabBar({ t }: { t: IOSTokens }) {
  return (
    <div className="flex-shrink-0 flex justify-around items-start pt-1.5 pb-5 border-t-[0.5px]"
      style={{ background: t.tabBarBg, borderColor: t.hairline, backdropFilter: 'blur(20px)' }}>
      {AS_TABS.map(tab => (
        <div key={tab.label} className="flex flex-col items-center gap-[1px] min-w-0 px-1">
          <svg viewBox="0 0 24 24" width="26" height="26"
            style={{ fill: tab.active ? t.systemBlue : t.secondaryLabel }}>
            <path d={tab.path} />
          </svg>
          <span className="font-medium" style={{ color: tab.active ? t.systemBlue : t.secondaryLabel, fontSize: '10px' }}>
            {tab.label}
          </span>
        </div>
      ))}
    </div>
  )
}

function UploadIconZone({ icon, size, borderRadius, onUpload }: {
  icon: string | null
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
        : <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-blue-600" />}
      {onUpload && !icon && (
        <div className="absolute inset-0 flex items-end justify-center pb-1.5">
          <span className="text-[8px] text-white/80 bg-black/30 px-1.5 py-0.5 rounded-full">tap to upload</span>
        </div>
      )}
      {onUpload && (
        <input ref={inputRef} type="file" accept="image/*" className="sr-only"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
      )}
    </div>
  )
}

function UploadScreenshotSlot({ src, index, height, width, borderRadius, t, onUpload }: {
  src?: string
  index: number
  height: number | string
  width: number | string
  borderRadius: string
  t: IOSTokens
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
      style={{ width, height, borderRadius, background: src ? 'transparent' : t.starEmpty, cursor: onUpload ? 'pointer' : 'default' }}
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
              <svg viewBox="0 0 24 24" className="w-5 h-5" style={{ fill: t.secondaryLabel }}>
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
            )}
            <span className="text-[9px] text-center px-1" style={{ color: t.secondaryLabel }}>
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

const AS_COMPETITORS = [
  {
    renderIcon: () => (
      <svg viewBox="0 0 60 60" className="w-full h-full">
        <rect width="60" height="60" rx="13" fill="#FAFAFA"/>
        <text x="9" y="48" fontSize="46" fontFamily="Georgia,serif" fontWeight="900" fill="#1C1C1E">N</text>
      </svg>
    ),
    name: 'Notion — Notes & Projects', subtitle: 'Organize Your Work & Life',
    developer: 'Notion Labs, Inc.', category: 'Productivity',
    rating: 4.7, reviewCount: '125.4K', hasIAP: true, prefix: 'asc1',
  },
  {
    renderIcon: () => (
      <svg viewBox="0 0 60 60" className="w-full h-full">
        <rect width="60" height="60" rx="13" fill="#FC7041"/>
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
  t: IOSTokens
  prefix: string
  screenshots?: string[]
  isUserApp?: boolean
  onUploadIcon?: (dataUrl: string) => void
  onUploadScreenshot?: (index: number, dataUrl: string) => void
  userIcon?: string | null
}

function SearchAppCard({
  renderIcon, name, subtitle, developer, category, rating, reviewCount, hasIAP, t, prefix,
  screenshots = [], isUserApp, onUploadIcon, onUploadScreenshot, userIcon,
}: SearchCardProps) {
  return (
    <div>
      {/* Row 1: icon + name/subtitle + Get button */}
      <div className="flex items-start gap-3 px-3.5 pt-3 pb-1">
        {isUserApp ? (
          <UploadIconZone icon={userIcon ?? null} size={62} borderRadius="13.5px" onUpload={onUploadIcon} />
        ) : (
          <div className="flex-shrink-0 overflow-hidden" style={{ width: 62, height: 62, borderRadius: '13.5px' }}>
            {renderIcon()}
          </div>
        )}
        <div className="flex-1 min-w-0 pt-0">
          <p className="font-semibold leading-tight line-clamp-2" style={{ color: t.label, fontSize: '14px' }}>{name}</p>
          <p className="mt-0.5 line-clamp-2" style={{ color: t.secondaryLabel, fontSize: '12px', lineHeight: '1.2' }}>{subtitle}</p>
        </div>
        <div className="flex flex-col items-center gap-0.5 flex-shrink-0 pt-1">
          <button
            className="font-semibold px-4 rounded-full"
            style={{ background: t.buttonTint, color: t.systemBlue, fontSize: '14px', height: '28px', minWidth: '64px' }}
          >
            GET
          </button>
          {hasIAP && (
            <span className="text-center leading-tight" style={{ color: t.secondaryLabel, fontSize: '9px' }}>In-App<br/>Purchases</span>
          )}
        </div>
      </div>

      {/* Row 2: stars · reviews · dev · category */}
      <div className="flex items-center gap-1 px-3.5 pb-2.5 pt-1">
        <Stars rating={rating} size={10} emptyColor={t.starEmpty} prefix={prefix} />
        <span style={{ color: t.secondaryLabel, fontSize: '10px' }}>{reviewCount}</span>
        <span className="mx-1" style={{ color: t.tertiaryLabel, fontSize: '10px' }}>·</span>
        <User className="w-2.5 h-2.5 flex-shrink-0" style={{ color: t.secondaryLabel }} />
        <span className="line-clamp-1 min-w-0" style={{ color: t.secondaryLabel, fontSize: '10px' }}>{developer}</span>
        <span className="mx-1" style={{ color: t.tertiaryLabel, fontSize: '10px' }}>·</span>
        <Grid3X3 className="w-2.5 h-2.5 flex-shrink-0" style={{ color: t.secondaryLabel }} />
        <span className="line-clamp-1" style={{ color: t.secondaryLabel, fontSize: '10px' }}>{category}</span>
      </div>

      {/* Row 3: screenshots — 3 wide, equal flex */}
      <div className="flex px-3.5 pb-3 gap-2">
        {[0, 1, 2].map(i => (
          isUserApp ? (
            <UploadScreenshotSlot
              key={i}
              src={screenshots[i]}
              index={i}
              height={193}
              width="100%"
              borderRadius="10px"
              t={t}
              onUpload={onUploadScreenshot}
            />
          ) : (
            <div key={i} className="flex-1 rounded-[10px]"
              style={{ height: 193, background: t.starEmpty }} />
          )
        ))}
      </div>
    </div>
  )
}

function SearchView({ data, t, onUploadIcon, onUploadScreenshot }: {
  data: AppData, t: IOSTokens, onUploadIcon?: (d: string) => void, onUploadScreenshot?: (i: number, d: string) => void
}) {
  const reviews = formatReviews(data.reviewCount)

  return (
    <div className="h-full flex flex-col" style={{ background: t.systemBackground, fontFamily: 'var(--font-ios), -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <StatusBar t={t} />

      {/* Search field row sticky */}
      <div className="flex-shrink-0 px-4 pb-2 flex items-center gap-3" style={{ background: t.systemBackground }}>
        <div className="flex-1 flex items-center gap-1.5 rounded-[10px] px-2.5"
          style={{ background: t.searchFieldBg, height: '36px' }}>
          <Search className="w-4 h-4" style={{ color: t.searchFieldText }} />
          <span className="flex-1" style={{ color: t.searchFieldText, fontSize: '15px' }}>Search</span>
          <div className="flex items-center gap-1">
            <button className="flex-shrink-0 w-[18px] h-[18px] rounded-full flex items-center justify-center" style={{ background: t.starEmpty }}>
              <X className="w-2.5 h-2.5" style={{ color: t.searchFieldBg }} strokeWidth={3}/>
            </button>
          </div>
        </div>
        <button style={{ color: t.systemBlue, fontSize: '15px' }}>Cancel</button>
      </div>

      {/* Related search chips sticky */}
      <div className="flex-shrink-0 flex gap-2 px-4 pb-3 overflow-x-auto [&::-webkit-scrollbar]:hidden"
        style={{ background: t.systemBackground }}>
        {['puzzle', 'car', 'cooking', 'brain', 'word', 'offline'].map(chip => (
          <div key={chip}
            className="flex-shrink-0 px-3 py-1 rounded-full whitespace-nowrap"
            style={{ background: t.searchFieldBg, color: t.label, fontSize: '12px', lineHeight: '20px' }}>
            {chip}
          </div>
        ))}
      </div>

      {/* Scrollable cards */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden px-3 pb-3 flex flex-col gap-3">
        <div style={{ background: t.cardSearchTint, borderRadius: '14px' }} className="overflow-hidden">
          <SearchAppCard
            renderIcon={() => null}
            name={data.appName || 'App Name'}
            subtitle={data.subtitle || 'App Subtitle'}
            developer={data.developerName || 'Developer'}
            category={data.category || 'App'}
            rating={data.rating}
            reviewCount={reviews}
            hasIAP={data.hasInAppPurchases}
            t={t}
            prefix="asusr"
            screenshots={data.screenshots}
            isUserApp
            onUploadIcon={onUploadIcon}
            onUploadScreenshot={onUploadScreenshot}
            userIcon={data.iconDataUrl || null}
          />
        </div>

        {AS_COMPETITORS.map((comp, idx) => (
          <div key={idx} style={{ background: t.cardSearchTint, borderRadius: '14px' }} className="overflow-hidden">
            <SearchAppCard
              renderIcon={comp.renderIcon}
              name={comp.name}
              subtitle={comp.subtitle}
              developer={comp.developer}
              category={comp.category}
              rating={comp.rating}
              reviewCount={comp.reviewCount}
              hasIAP={comp.hasIAP}
              t={t}
              prefix={comp.prefix}
              isUserApp={false}
            />
          </div>
        ))}
      </div>

      <BottomTabBar t={t} />
    </div>
  )
}

function DetailView({ data, t, onUploadIcon, onUploadScreenshot }: {
  data: AppData, t: IOSTokens, onUploadIcon?: (d: string) => void, onUploadScreenshot?: (i: number, d: string) => void
}) {
  const price = formatPrice(data.price)
  const rating = formatRating(data.rating)
  const reviews = formatReviews(data.reviewCount)
  const btn = price === 'Free' ? 'Get' : price

  const maxShots = 10
  const slots = Math.min(Math.max(data.screenshots.length + (onUploadScreenshot && data.screenshots.length < maxShots ? 1 : 0), 3), maxShots)

  return (
    <div className="h-full flex flex-col" style={{ background: t.systemBackground, fontFamily: 'var(--font-ios), -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <StatusBar t={t} />

      {/* Nav row */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 py-1" style={{ background: t.systemBackground }}>
        <button className="w-9 h-9 flex items-center justify-center rounded-full" style={{ background: t.searchFieldBg }}>
          <ChevronLeft className="w-5 h-5" style={{ color: t.systemBlue }} strokeWidth={2.5} />
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-full" style={{ background: t.searchFieldBg }}>
          <Share className="w-[18px] h-[18px]" style={{ color: t.systemBlue }} strokeWidth={2} />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
        {/* App header */}
        <div className="px-4 pb-4 flex gap-4" style={{ background: t.systemBackground }}>
          <UploadIconZone icon={data.iconDataUrl || null} size={114} borderRadius="24px" onUpload={onUploadIcon} />
          <div className="flex-1 min-w-0 pt-0.5 flex flex-col">
            <h1 className="font-bold leading-[1.1]" style={{ color: t.label, fontSize: '20px' }}>
              {data.appName || 'App Name'}
            </h1>
            <p className="mt-1 line-clamp-1" style={{ color: t.secondaryLabel, fontSize: '14px' }}>
              {data.subtitle || 'App Subtitle'}
            </p>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <button
                className="font-bold rounded-full text-center"
                style={{ background: t.systemBlue, color: '#fff', minWidth: '74px', height: '30px', padding: '0 22px', fontSize: '15px', letterSpacing: '0.1px' }}>
                {btn}
              </button>
              {data.hasInAppPurchases && (
                <span className="leading-tight" style={{ color: t.secondaryLabel, fontSize: '9px' }}>In-App<br/>Purchases</span>
              )}
            </div>
          </div>
        </div>

        <div style={{ height: '0.5px', background: t.hairline, margin: '0 16px' }} />

        {/* Badges row — 4 columns: label TOP, big value MIDDLE, sublabel BOTTOM */}
        <div className="flex" style={{ background: t.systemBackground }}>
          {([
            {
              label: `${reviews} Ratings`,
              big: <div className="font-bold leading-none" style={{ color: t.label, fontSize: '20px' }}>{rating}</div>,
              sub: <Stars rating={data.rating} size={9} emptyColor={t.starEmpty} prefix="asdt" />,
            },
            {
              label: 'Age Rating',
              big: <div className="font-bold leading-none" style={{ color: t.label, fontSize: '20px' }}>4+</div>,
              sub: <span style={{ color: t.secondaryLabel, fontSize: '9px' }}>Years</span>,
            },
            {
              label: 'Category',
              big: <Grid3X3 className="w-5 h-5" style={{ color: t.secondaryLabel }} strokeWidth={2} />,
              sub: <span className="font-semibold line-clamp-1" style={{ color: t.label, fontSize: '10px' }}>{data.category || 'Utilities'}</span>,
            },
            {
              label: 'Developer',
              big: <User className="w-5 h-5" style={{ color: t.secondaryLabel }} strokeWidth={2} />,
              sub: <span className="font-semibold line-clamp-1" style={{ color: t.label, fontSize: '10px' }}>{data.developerName || 'Developer'}</span>,
            },
          ] as { label: string, big: React.ReactNode, sub: React.ReactNode }[]).map((item, idx, arr) => (
            <div key={idx}
              className="flex-1 flex flex-col items-center justify-between py-3 px-1 text-center gap-1.5"
              style={{ borderRight: idx < arr.length - 1 ? `0.5px solid ${t.hairline}` : 'none', minHeight: '78px' }}>
              <div className="uppercase font-semibold tracking-wider" style={{ color: t.secondaryLabel, fontSize: '9px' }}>{item.label}</div>
              <div className="flex items-center justify-center">{item.big}</div>
              <div className="flex justify-center w-full px-0.5">{item.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ height: '0.5px', background: t.hairline, margin: '0 16px' }} />

        {/* Screenshots — large portrait, scroll horizontal */}
        <div className="py-4" style={{ background: t.systemBackground }}>
          <DragScrollX className="px-4 gap-3">
            {Array.from({ length: slots }).map((_, i) => (
              <UploadScreenshotSlot
                key={i}
                src={data.screenshots[i]}
                index={i}
                height={260}
                width={data.screenshots[i] ? 142 : 130}
                borderRadius="14px"
                t={t}
                onUpload={onUploadScreenshot}
              />
            ))}
          </DragScrollX>
        </div>

        <div style={{ height: '0.5px', background: t.hairline, margin: '0 16px' }} />

        {/* Description */}
        <div className="px-4 py-4" style={{ background: t.systemBackground }}>
          <p className="leading-relaxed line-clamp-3" style={{ color: t.label, fontSize: '14px' }}>
            {data.subtitle || 'Short description of your app. This section shows your app\'s long description from the App Store listing.'}
          </p>
          <button className="mt-1 font-semibold" style={{ color: t.systemBlue, fontSize: '14px' }}>more</button>
        </div>

        {/* Ratings widget */}
        <div className="px-4 py-3 mt-2" style={{ background: t.systemBackground, borderTop: `0.5px solid ${t.hairline}` }}>
          <h2 className="font-bold mb-3" style={{ color: t.label, fontSize: '17px' }}>Ratings &amp; Reviews</h2>
          <div className="flex items-end gap-4">
            <div className="text-center">
              <div className="font-bold leading-none" style={{ color: t.label, fontSize: '46px', letterSpacing: '-1.5px' }}>{rating}</div>
              <div className="flex justify-center mt-1.5">
                <Stars rating={data.rating} size={11} emptyColor={t.starEmpty} prefix="asdtb" />
              </div>
              <div className="mt-1" style={{ color: t.secondaryLabel, fontSize: '11px' }}>out of 5</div>
            </div>
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map(star => {
                const pct = star === 5 ? 85 : star === 4 ? 10 : star === 3 ? 3 : 1
                return (
                  <div key={star} className="flex items-center gap-1.5 mb-0.5">
                    <span className="w-2 text-right" style={{ color: t.secondaryLabel, fontSize: '10px' }}>{star}</span>
                    <div className="flex-1 rounded-full overflow-hidden" style={{ background: t.hairline, height: '4px' }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: t.secondaryLabel }} />
                    </div>
                  </div>
                )
              })}
              <div className="mt-1" style={{ color: t.secondaryLabel, fontSize: '11px' }}>{reviews} Ratings</div>
            </div>
          </div>
        </div>

        <div className="h-6" />
      </div>

      <BottomTabBar t={t} />
    </div>
  )
}

export function AppStorePreview({ data, dark = false, mode = 'search', onUploadIcon, onUploadScreenshot }: Props) {
  const theme: Theme = dark ? 'dark' : 'light'
  const t = iosTokens(theme)
  return mode === 'search'
    ? <SearchView data={data} t={t} onUploadIcon={onUploadIcon} onUploadScreenshot={onUploadScreenshot} />
    : <DetailView data={data} t={t} onUploadIcon={onUploadIcon} onUploadScreenshot={onUploadScreenshot} />
}
