import { AppData } from '@/lib/types'
import { formatReviews, formatRating, formatPrice } from '@/lib/formatters'

interface Props { data: AppData }

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-px">
      {[1,2,3,4,5].map(i => {
        const full = rating >= i
        const partial = !full && rating > i - 1
        const pct = partial ? Math.round((rating - (i-1)) * 100) : 0
        return (
          <svg key={i} width="12" height="12" viewBox="0 0 24 24">
            <defs>
              <linearGradient id={`sg${i}-${Math.round(rating*10)}`}>
                <stop offset={`${full ? 100 : pct}%`} stopColor="#F5A623"/>
                <stop offset={`${full ? 100 : pct}%`} stopColor="#D1D5DB"/>
              </linearGradient>
            </defs>
            <path fill={`url(#sg${i}-${Math.round(rating*10)})`}
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        )
      })}
    </div>
  )
}

export function GooglePlayPreview({ data }: Props) {
  const price = formatPrice(data.price)
  const rating = formatRating(data.rating)
  const reviews = formatReviews(data.reviewCount)

  return (
    <div className="bg-white min-h-full font-sans text-[#202124]">
      {/* Status bar */}
      <div className="flex justify-between items-center px-4 pt-5 pb-1 text-[10px] font-medium">
        <span>9:41</span>
        <div className="flex items-center gap-1 text-[9px]">
          <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>
          <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>
        </div>
      </div>

      {/* Top nav */}
      <div className="flex items-center px-2 pb-2 gap-1">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#5f6368]"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        </button>
        <div className="flex-1 bg-[#f1f3f4] rounded-full px-4 py-2 flex items-center gap-2 h-9">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#5f6368] flex-shrink-0"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <span className="text-[#5f6368] text-[12px]">Search for apps &amp; games</span>
        </div>
        <button className="p-2">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#5f6368]"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
        </button>
      </div>

      {/* App header */}
      <div className="px-4 pb-3 flex gap-4">
        <div className="w-[72px] h-[72px] rounded-[16px] overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm">
          {data.iconDataUrl
            ? <img src={data.iconDataUrl} alt="icon" className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />}
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <h1 className="font-medium text-[16px] leading-tight text-[#202124] line-clamp-2">
            {data.appName || 'App Name'}
          </h1>
          <p className="text-[#01875f] text-[12px] mt-1 font-medium">
            {data.developerName || 'Developer'}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[12px] font-medium text-[#202124]">{rating}</span>
            <Stars rating={data.rating} />
            <span className="text-[10px] text-[#5f6368]">({reviews})</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-4 pb-3 flex gap-2">
        <button className="flex-1 bg-[#01875f] text-white text-[13px] font-medium py-2.5 rounded-full tracking-wide">
          {price === 'Free' ? 'Install' : price}
        </button>
        <button className="px-4 bg-white border border-[#dadce0] text-[#01875f] text-[13px] font-medium py-2.5 rounded-full">
          Wishlist
        </button>
      </div>

      {/* Badges */}
      {data.hasInAppPurchases && (
        <div className="px-4 pb-3">
          <span className="text-[10px] text-[#5f6368] bg-[#f1f3f4] px-2 py-1 rounded-full">
            In-app purchases
          </span>
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-[#e0e0e0] mx-4 mb-3" />

      {/* Info row */}
      <div className="flex px-4 pb-3 gap-0">
        {[
          { val: data.category || 'Games', label: 'Category' },
          { val: rating + '★', label: 'Rating' },
          { val: reviews, label: 'Reviews' },
        ].map((item, idx, arr) => (
          <div key={item.label} className={`flex-1 text-center ${idx < arr.length-1 ? 'border-r border-[#e0e0e0]' : ''}`}>
            <div className="text-[13px] font-medium text-[#202124]">{item.val}</div>
            <div className="text-[10px] text-[#5f6368] mt-0.5">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-[#e0e0e0] mx-4 mb-3" />

      {/* Screenshots */}
      <div className="px-4 pb-3">
        <div className="flex gap-2 overflow-x-auto">
          {data.screenshots.length > 0
            ? data.screenshots.slice(0, 3).map((src, i) => (
                <img key={i} src={src} alt="" className="h-[120px] w-auto rounded-lg flex-shrink-0 object-cover" />
              ))
            : [0,1,2].map(i => (
                <div key={i} className="h-[120px] w-[68px] rounded-lg bg-[#f1f3f4] flex-shrink-0 flex items-center justify-center">
                  <span className="text-[8px] text-[#9aa0a6] text-center px-1">Screenshot {i+1}</span>
                </div>
              ))}
        </div>
      </div>

      {/* About */}
      <div className="h-px bg-[#e0e0e0] mx-4 mb-3" />
      <div className="px-4 pb-4">
        <h2 className="text-[14px] font-medium text-[#202124] mb-2">About this app</h2>
        <p className="text-[11px] text-[#5f6368] leading-relaxed line-clamp-3">
          {data.subtitle || 'Short description of your app. Up to 80 characters appear here in search results.'}
        </p>
        <button className="text-[11px] text-[#01875f] mt-1 font-medium">read more</button>
      </div>
    </div>
  )
}
