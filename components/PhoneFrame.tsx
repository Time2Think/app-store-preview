interface PhoneFrameProps {
  type: 'android' | 'ios'
  children: React.ReactNode
  overlay?: React.ReactNode
}

export function PhoneFrame({ type, children, overlay }: PhoneFrameProps) {
  if (type === 'ios') return <IPhoneFrame overlay={overlay}>{children}</IPhoneFrame>
  return <AndroidFrame overlay={overlay}>{children}</AndroidFrame>
}

function IPhoneFrame({ children, overlay }: { children: React.ReactNode, overlay?: React.ReactNode }) {
  return (
    <div className="relative w-[360px] select-none">
      {/* Outer shell */}
      <div className="relative bg-[#1a1a1a] rounded-[54px] p-[12px] shadow-2xl ring-1 ring-white/10">
        {/* Side buttons left */}
        <div className="absolute left-[-3px] top-[128px] w-[3px] h-10 bg-[#2a2a2a] rounded-l-sm" />
        <div className="absolute left-[-3px] top-[190px] w-[3px] h-16 bg-[#2a2a2a] rounded-l-sm" />
        <div className="absolute left-[-3px] top-[270px] w-[3px] h-16 bg-[#2a2a2a] rounded-l-sm" />
        {/* Side button right (power) */}
        <div className="absolute right-[-3px] top-[190px] w-[3px] h-20 bg-[#2a2a2a] rounded-r-sm" />
        {/* Screen */}
        <div className="relative bg-black rounded-[44px] overflow-hidden" style={{ aspectRatio: '393/852' }}>
          {/* Content (scrollable) */}
          <div className="absolute inset-0 overflow-y-auto [&::-webkit-scrollbar]:hidden">
            {children}
          </div>
          {/* Reference overlay — pinned to viewport, on top of content */}
          {overlay}
          {/* Dynamic Island — always on top */}
          <div className="absolute top-[12px] left-1/2 -translate-x-1/2 w-[110px] h-[34px] bg-black rounded-full z-50" />
        </div>
      </div>
    </div>
  )
}

function AndroidFrame({ children, overlay }: { children: React.ReactNode, overlay?: React.ReactNode }) {
  return (
    <div className="relative w-[360px] select-none">
      {/* Outer shell */}
      <div className="relative bg-[#1a1a1a] rounded-[46px] p-[12px] shadow-2xl ring-1 ring-white/10">
        {/* Side buttons right */}
        <div className="absolute right-[-3px] top-[155px] w-[3px] h-12 bg-[#2a2a2a] rounded-r-sm" />
        <div className="absolute right-[-3px] top-[220px] w-[3px] h-20 bg-[#2a2a2a] rounded-r-sm" />
        {/* Screen */}
        <div className="relative bg-[#0f0f0f] rounded-[36px] overflow-hidden" style={{ aspectRatio: '9/19.5' }}>
          {/* Content (scrollable) */}
          <div className="absolute inset-0 overflow-y-auto [&::-webkit-scrollbar]:hidden">
            {children}
          </div>
          {/* Reference overlay — pinned to viewport */}
          {overlay}
          {/* Punch-hole camera — always on top */}
          <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[18px] h-[18px] bg-black rounded-full z-50 ring-1 ring-[#1a1a1a]" />
        </div>
      </div>
    </div>
  )
}
