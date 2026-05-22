import { AppData } from '@/lib/types'
import { formatReviews, formatRating, formatPrice } from '@/lib/formatters'

interface GooglePlayPreviewProps {
  data: AppData
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => {
        const filled = rating >= i
        const half = !filled && rating >= i - 0.5
        return (
          <span key={i} className={`text-[10px] ${filled || half ? 'text-[#f5a623]' : 'text-gray-300'}`}>
            {half ? '½' : '★'}
          </span>
        )
      })}
    </div>
  )
}

export function GooglePlayPreview({ data }: GooglePlayPreviewProps) {
  const price = formatPrice(data.price)
  const rating = formatRating(data.rating)
  const reviews = formatReviews(data.reviewCount)

  return (
    <div className="bg-white text-[#202124] min-h-full text-[11px] font-sans">
      {/* Status bar */}
      <div className="flex justify-between items-center px-3 py-1 bg-white text-[9px] text-gray-500 pt-6">
        <span>9:41</span>
        <div className="flex gap-1 items-center">
          <span>▲▲▲</span>
          <span>WiFi</span>
          <span>🔋</span>
        </div>
      </div>

      {/* Top nav */}
      <div className="flex items-center px-3 py-2 gap-2">
        <span className="text-[#01875f] text-base">←</span>
        <div className="flex-1 bg-[#f1f3f4] rounded-full px-3 py-1.5 flex items-center gap-2">
          <span className="text-gray-400 text-xs">🔍</span>
          <span className="text-gray-400 text-[10px]">Search for apps & games</span>
        </div>
      </div>

      {/* App header */}
      <div className="px-4 py-3 flex gap-3">
        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
          {data.iconDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.iconDataUrl} alt="icon" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-medium text-[13px] leading-tight line-clamp-2 text-[#202124]">
            {data.appName || 'App Name'}
          </h1>
          <p className="text-[#01875f] text-[11px] mt-0.5">{data.developerName || 'Developer'}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[10px] font-medium">{rating}</span>
            <StarRating rating={data.rating} />
            <span className="text-gray-500 text-[9px]">({reviews})</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-4 flex gap-2 mb-3">
        <button className="flex-1 bg-[#01875f] text-white text-[11px] font-medium py-2 rounded-full">
          {price === 'Free' ? 'Install' : price}
        </button>
        {data.hasInAppPurchases && (
          <div className="flex items-center">
            <span className="text-gray-500 text-[9px]">In-app purchases</span>
          </div>
        )}
      </div>

      {/* Meta row */}
      <div className="px-4 flex gap-4 py-2 border-t border-b border-gray-100">
        {[
          { label: data.category || 'Category', sub: 'Category' },
          { label: `${rating}★`, sub: 'Rating' },
          { label: reviews, sub: 'Reviews' },
        ].map(item => (
          <div key={item.sub} className="flex-1 text-center">
            <div className="text-[11px] font-medium text-[#202124]">{item.label}</div>
            <div className="text-[9px] text-gray-500">{item.sub}</div>
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="px-4 py-3">
        <p className="text-[10px] text-gray-600 leading-relaxed line-clamp-3">
          {data.subtitle || 'Short description of your app goes here. Describe the key features in 80 characters.'}
        </p>
      </div>

      {/* Screenshots */}
      {data.screenshots.length > 0 && (
        <div className="px-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {data.screenshots.slice(0, 3).map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt={`Screenshot ${i + 1}`}
                className="h-36 w-auto rounded-lg object-cover flex-shrink-0"
              />
            ))}
          </div>
        </div>
      )}
      {data.screenshots.length === 0 && (
        <div className="px-4 flex gap-2">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-36 w-20 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center">
              <span className="text-gray-300 text-[9px] text-center">Screenshot {i + 1}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
