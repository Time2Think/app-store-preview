import { PreviewMode } from '@/lib/types'

interface Props {
  store: 'ios' | 'android'
  mode: PreviewMode
  opacity: number
}

export function ReferenceOverlay({ store, mode, opacity }: Props) {
  if (opacity <= 0) return null
  const ext = store === 'ios' ? 'jpeg' : 'jpg'
  const src = `/refs/${store}/${mode}.${ext}`
  return (
    <div
      className="absolute inset-0 z-40 pointer-events-none"
      style={{ opacity }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`${store} ${mode} reference`}
        className="w-full h-full object-cover object-top"
      />
    </div>
  )
}
