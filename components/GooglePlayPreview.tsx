import { AppData, PreviewMode } from '@/lib/types'
import { formatReviews, formatRating, formatPrice } from '@/lib/formatters'

interface Props {
  data: AppData
  dark?: boolean
  mode?: PreviewMode
}

type C = {
  bg: string
  card: string
  text: string
  sub: string
  divider: string
  searchBg: string
  searchIcon: string
  green: string
  greenText: string
  border: string
  chip: string
}

function colors(dark: boolean): C {
  if (dark) return {
    bg: '#121212',
    card: '#1e1e1e',
    text: '#e8eaed',
    sub: '#9aa0a6',
    divider: '#3c4043',
    searchBg: '#303134',
    searchIcon: '#9aa0a6',
    green: '#34a853',
    greenText: '#34a853',
    border: '#5f6368',
    chip: '#303134',
  }
  return {
    bg: '#ffffff',
    card: '#ffffff',
    text: '#202124',
    sub: '#5f6368',
    divider: '#e0e0e0',
    searchBg: '#f1f3f4',
    searchIcon: '#5f6368',
    green: '#01875f',
    greenText: '#01875f',
    border: '#dadce0',
    chip: '#f1f3f4',
  }
}

function Stars({ rating, c }: { rating: number, c: C }) {
  const r = Math.round(rating * 10)
  return (
    <div className="flex gap-px">
      {[1, 2, 3, 4, 5].map(i => {
        const full = rating >= i
        const partial = !full && rating > i - 1
        const pct = partial ? Math.round((rating - (i - 1)) * 100) : 0
        const id = `gpstar${i}x${r}`
        return (
          <svg key={i} width="12" height="12" viewBox="0 0 24 24">
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

function StarsSearch({ rating, c, prefix }: { rating: number, c: C, prefix: string }) {
  const r = Math.round(rating * 10)
  return (
    <div className="flex gap-px">
      {[1, 2, 3, 4, 5].map(i => {
        const full = rating >= i
        const partial = !full && rating > i - 1
        const pct = partial ? Math.round((rating - (i - 1)) * 100) : 0
        const id = `${prefix}${i}x${r}`
        return (
          <svg key={i} width="10" height="10" viewBox="0 0 24 24">
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

function DetailView({ data, c }: { data: AppData, c: C }) {
  const price = formatPrice(data.price)
  const rating = formatRating(data.rating)
  const reviews = formatReviews(data.reviewCount)

  return (
    <div className="min-h-full font-sans" style={{ background: c.bg, color: c.text }}>
      {/* Status bar */}
      <div className="flex justify-between items-center px-4 pt-5 pb-1 text-[10px] font-medium">
        <span>9:41</span>
        <div className="flex items-center gap-1 text-[9px]">
          <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
            <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
          </svg>
          <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
            <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
          </svg>
        </div>
      </div>

      {/* Top nav */}
      <div className="flex items-center px-2 pb-2 gap-1">
        <button className="p-2 rounded-full" style={{ color: c.sub }}>
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </button>
        <div className="flex-1 rounded-full px-4 py-2 flex items-center gap-2 h-9" style={{ background: c.searchBg }}>
          <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" style={{ fill: c.searchIcon }}>
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <span className="text-[12px]" style={{ color: c.sub }}>Search for apps &amp; games</span>
        </div>
        <button className="p-2" style={{ color: c.sub }}>
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
      </div>

      {/* App header */}
      <div className="px-4 pb-3 flex gap-4">
        <div className="w-[72px] h-[72px] rounded-[16px] overflow-hidden flex-shrink-0 shadow-sm" style={{ background: c.divider }}>
          {data.iconDataUrl
            ? <img src={data.iconDataUrl} alt="icon" className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />}
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <h1 className="font-medium text-[16px] leading-tight line-clamp-2">{data.appName || 'App Name'}</h1>
          <p className="text-[12px] mt-1 font-medium" style={{ color: c.greenText }}>
            {data.developerName || 'Developer'}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[12px] font-medium">{rating}</span>
            <Stars rating={data.rating} c={c} />
            <span className="text-[10px]" style={{ color: c.sub }}>({reviews})</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-4 pb-3 flex gap-2">
        <button className="flex-1 text-white text-[13px] font-medium py-2.5 rounded-full tracking-wide"
          style={{ background: c.green }}>
          {price === 'Free' ? 'Install' : price}
        </button>
        <button className="px-4 text-[13px] font-medium py-2.5 rounded-full"
          style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.greenText }}>
          Wishlist
        </button>
      </div>

      {data.hasInAppPurchases && (
        <div className="px-4 pb-3">
          <span className="text-[10px] px-2 py-1 rounded-full" style={{ color: c.sub, background: c.chip }}>
            In-app purchases
          </span>
        </div>
      )}

      <div className="mx-4 mb-3" style={{ height: '1px', background: c.divider }} />

      {/* Info row */}
      <div className="flex px-4 pb-3 gap-0">
        {[
          { val: data.category || 'Games', label: 'Category' },
          { val: rating + '★', label: 'Rating' },
          { val: reviews, label: 'Reviews' },
        ].map((item, idx, arr) => (
          <div key={item.label} className={`flex-1 text-center ${idx < arr.length - 1 ? 'border-r' : ''}`}
            style={{ borderColor: c.divider }}>
            <div className="text-[13px] font-medium">{item.val}</div>
            <div className="text-[10px] mt-0.5" style={{ color: c.sub }}>{item.label}</div>
          </div>
        ))}
      </div>

      <div className="mx-4 mb-3" style={{ height: '1px', background: c.divider }} />

      {/* Screenshots */}
      <div className="px-4 pb-3">
        <div className="flex gap-2 overflow-x-auto">
          {data.screenshots.length > 0
            ? data.screenshots.slice(0, 3).map((src, i) => (
              <img key={i} src={src} alt="" className="h-[120px] w-auto rounded-lg flex-shrink-0 object-cover" />
            ))
            : [0, 1, 2].map(i => (
              <div key={i} className="h-[120px] w-[68px] rounded-lg flex-shrink-0 flex items-center justify-center"
                style={{ background: c.searchBg }}>
                <span className="text-[8px] text-center px-1" style={{ color: c.sub }}>Screenshot {i + 1}</span>
              </div>
            ))}
        </div>
      </div>

      <div className="mx-4 mb-3" style={{ height: '1px', background: c.divider }} />

      {/* About */}
      <div className="px-4 pb-4">
        <h2 className="text-[14px] font-medium mb-2">About this app</h2>
        <p className="text-[11px] leading-relaxed line-clamp-3" style={{ color: c.sub }}>
          {data.subtitle || 'Short description of your app. Up to 80 characters appear here in search results.'}
        </p>
        <button className="text-[11px] mt-1 font-medium" style={{ color: c.greenText }}>read more</button>
      </div>
    </div>
  )
}

const GP_COMPETITORS = [
  {
    icon: null,
    gradient: 'from-green-400 to-teal-500',
    name: 'Duolingo: Language Lessons',
    developer: 'Duolingo',
    rating: 4.7,
    reviews: '14.2M',
    prefix: 'gpc1',
  },
  {
    icon: null,
    gradient: 'from-purple-500 to-indigo-600',
    name: 'Spotify: Music & Podcasts',
    developer: 'Spotify AB',
    rating: 4.3,
    reviews: '32.1M',
    prefix: 'gpc2',
  },
  {
    icon: null,
    gradient: 'from-yellow-400 to-orange-500',
    name: 'Canva: Design, Art & AI Editor',
    developer: 'Canva',
    rating: 4.8,
    reviews: '6.5M',
    prefix: 'gpc3',
  },
]

function SearchView({ data, c }: { data: AppData, c: C }) {
  const price = formatPrice(data.price)
  const reviews = formatReviews(data.reviewCount)
  const rating = formatRating(data.rating)

  return (
    <div className="min-h-full font-sans" style={{ background: c.bg, color: c.text }}>
      {/* Status bar */}
      <div className="flex justify-between items-center px-4 pt-5 pb-1 text-[10px] font-medium">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
            <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
          </svg>
          <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
            <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
          </svg>
        </div>
      </div>

      {/* Search bar */}
      <div className="flex items-center px-2 pb-2 gap-1">
        <button className="p-2" style={{ color: c.sub }}>
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </button>
        <div className="flex-1 rounded-full px-4 py-2 flex items-center gap-2 h-9" style={{ background: c.searchBg }}>
          <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" style={{ fill: c.searchIcon }}>
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <span className="text-[12px]" style={{ color: c.sub }}>Search apps &amp; games</span>
        </div>
        <button className="p-2" style={{ color: c.sub }}>
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 px-4 pb-3 overflow-x-hidden">
        {['Apps', 'Games', 'Books', 'Movies'].map((chip, i) => (
          <div key={chip} className="px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap"
            style={{
              background: i === 0 ? c.green : c.chip,
              color: i === 0 ? '#ffffff' : c.sub,
            }}>
            {chip}
          </div>
        ))}
      </div>

      <div style={{ height: '1px', background: c.divider }} />

      {/* User app result */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-[56px] h-[56px] rounded-[12px] overflow-hidden flex-shrink-0" style={{ background: c.divider }}>
          {data.iconDataUrl
            ? <img src={data.iconDataUrl} alt="icon" className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-[13px] line-clamp-1">{data.appName || 'App Name'}</p>
          <p className="text-[11px] mt-0.5" style={{ color: c.greenText }}>{data.developerName || 'Developer'}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-[10px]">{rating}</span>
            <StarsSearch rating={data.rating} c={c} prefix="gpusr" />
            <span className="text-[9px]" style={{ color: c.sub }}>({reviews})</span>
          </div>
          {data.hasInAppPurchases && (
            <span className="text-[9px]" style={{ color: c.sub }}>In-app purchases</span>
          )}
        </div>
        <button className="px-3 py-1.5 rounded-full text-[12px] font-medium text-white flex-shrink-0"
          style={{ background: c.green }}>
          {price === 'Free' ? 'Install' : price}
        </button>
      </div>

      {/* Competitors */}
      {GP_COMPETITORS.map((comp, idx) => (
        <div key={idx}>
          <div style={{ height: '1px', background: c.divider }} />
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-[56px] h-[56px] rounded-[12px] overflow-hidden flex-shrink-0">
              <div className={`w-full h-full bg-gradient-to-br ${comp.gradient}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[13px] line-clamp-1">{comp.name}</p>
              <p className="text-[11px] mt-0.5" style={{ color: c.greenText }}>{comp.developer}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px]">{formatRating(comp.rating)}</span>
                <StarsSearch rating={comp.rating} c={c} prefix={comp.prefix} />
                <span className="text-[9px]" style={{ color: c.sub }}>({comp.reviews})</span>
              </div>
            </div>
            <button className="px-3 py-1.5 rounded-full text-[12px] font-medium text-white flex-shrink-0"
              style={{ background: c.green }}>
              Install
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export function GooglePlayPreview({ data, dark = false, mode = 'detail' }: Props) {
  const c = colors(dark)
  return mode === 'search'
    ? <SearchView data={data} c={c} />
    : <DetailView data={data} c={c} />
}
