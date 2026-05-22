import { AppData } from '@/lib/types'
import { formatReviews, formatRating, formatPrice } from '@/lib/formatters'

interface Props { data: AppData }

function Stars({ rating, size = 10 }: { rating: number, size?: number }) {
  return (
    <div className="flex gap-px">
      {[1,2,3,4,5].map(i => {
        const full = rating >= i
        const partial = !full && rating > i - 1
        const pct = partial ? Math.round((rating - (i-1)) * 100) : 0
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24">
            <defs>
              <linearGradient id={`as${i}-${Math.round(rating*10)}`}>
                <stop offset={`${full ? 100 : pct}%`} stopColor="#FF9500"/>
                <stop offset={`${full ? 100 : pct}%`} stopColor="#D1D5DB"/>
              </linearGradient>
            </defs>
            <path fill={`url(#as${i}-${Math.round(rating*10)})`}
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        )
      })}
    </div>
  )
}

export function AppStorePreview({ data }: Props) {
  const price = formatPrice(data.price)
  const rating = formatRating(data.rating)
  const reviews = formatReviews(data.reviewCount)
  const btn = price === 'Free' ? 'GET' : price

  return (
    <div className="min-h-full font-sans" style={{ background: '#f2f2f7' }}>
      {/* Status bar */}
      <div className="flex justify-between items-center px-4 pt-9 pb-1 text-[12px] font-semibold">
        <span>9:41</span>
        <div className="flex items-center gap-1 text-[10px]">
          <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>
          <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>
        </div>
      </div>

      {/* Search bar */}
      <div className="px-4 pb-3">
        <div className="bg-white rounded-[10px] px-3 py-2 flex items-center gap-2 shadow-sm">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#8e8e93] flex-shrink-0"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <span className="text-[#8e8e93] text-[13px]">Search</span>
        </div>
      </div>

      {/* App result card */}
      <div className="mx-4 bg-white rounded-[12px] overflow-hidden shadow-sm mb-3">
        {/* Top row: icon + info + button */}
        <div className="flex items-center gap-3 p-3 pb-2">
          {/* Icon */}
          <div className="w-[60px] h-[60px] rounded-[13px] overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm">
            {data.iconDataUrl
              ? <img src={data.iconDataUrl} alt="icon" className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-blue-600" />}
          </div>

          {/* Name + subtitle + developer */}
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-[14px] leading-tight text-[#1c1c1e] line-clamp-1">
              {data.appName || 'App Name'}
            </h1>
            <p className="text-[#8e8e93] text-[11px] mt-0.5 line-clamp-1">
              {data.subtitle || 'App Subtitle'}
            </p>
            <p className="text-[#8e8e93] text-[10px] mt-0.5 line-clamp-1">
              {data.developerName || 'Developer'}
            </p>
          </div>

          {/* GET button */}
          <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
            <button className="bg-[#e8f0fe] text-[#007AFF] text-[13px] font-semibold px-5 py-1.5 rounded-full min-w-[62px] text-center">
              {btn}
            </button>
            {data.hasInAppPurchases && (
              <span className="text-[7px] text-[#8e8e93] text-center leading-tight whitespace-nowrap">In-App<br/>Purchases</span>
            )}
          </div>
        </div>

        {/* Rating row */}
        <div className="flex items-center gap-1.5 px-3 pb-2">
          <Stars rating={data.rating} size={9} />
          <span className="text-[10px] text-[#8e8e93]">{reviews} Ratings</span>
          <span className="text-[#c7c7cc] text-[10px] mx-1">·</span>
          <span className="text-[10px] text-[#8e8e93]">{data.category || 'App'}</span>
          {price !== 'Free' && (
            <>
              <span className="text-[#c7c7cc] text-[10px] mx-1">·</span>
              <span className="text-[10px] text-[#8e8e93]">{price}</span>
            </>
          )}
        </div>

        {/* Screenshots */}
        <div className="px-3 pb-3">
          <div className="flex gap-1.5 overflow-x-auto">
            {data.screenshots.length > 0
              ? data.screenshots.slice(0, 3).map((src, i) => (
                  <img key={i} src={src} alt="" className="h-[130px] w-auto rounded-[8px] object-cover flex-shrink-0 shadow-sm" />
                ))
              : [0,1,2].map(i => (
                  <div key={i} className="h-[130px] w-[70px] rounded-[8px] bg-[#f2f2f7] flex-shrink-0 flex items-center justify-center">
                    <span className="text-[7px] text-[#c7c7cc] text-center px-1">Screenshot {i+1}</span>
                  </div>
                ))}
          </div>
        </div>
      </div>

      {/* Rating numeric */}
      <div className="mx-4 bg-white rounded-[12px] p-3 shadow-sm">
        <div className="flex items-end gap-3">
          <div className="text-center">
            <div className="text-[42px] font-thin text-[#1c1c1e] leading-none">{rating}</div>
            <div className="text-[10px] text-[#8e8e93] mt-1">out of 5</div>
          </div>
          <div className="flex-1">
            {[5,4,3,2,1].map(star => {
              const pct = star === 5 ? 85 : star === 4 ? 10 : star === 3 ? 3 : star === 2 ? 1 : 1
              return (
                <div key={star} className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[8px] text-[#8e8e93] w-2">{star}</span>
                  <div className="flex-1 bg-[#e5e5ea] rounded-full h-[3px] overflow-hidden">
                    <div className="bg-[#8e8e93] h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
            <div className="text-[9px] text-[#8e8e93] mt-1">{reviews} Ratings</div>
          </div>
        </div>
        <div className="flex items-center justify-center mt-2">
          <Stars rating={data.rating} size={12} />
        </div>
      </div>
    </div>
  )
}
