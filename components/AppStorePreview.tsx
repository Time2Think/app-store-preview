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
    <div className="bg-[#f2f2f7] text-[#1c1c1e] min-h-full text-[11px] font-sans">
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
