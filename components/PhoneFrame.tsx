interface PhoneFrameProps {
  type: 'android' | 'ios'
  children: React.ReactNode
}

export function PhoneFrame({ type, children }: PhoneFrameProps) {
  if (type === 'ios') return <IPhoneFrame>{children}</IPhoneFrame>
  return <AndroidFrame>{children}</AndroidFrame>
}

function IPhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-[280px] select-none">
      {/* Outer shell */}
      <div className="relative bg-[#1a1a1a] rounded-[42px] p-[10px] shadow-2xl ring-1 ring-white/10">
        {/* Side buttons left */}
        <div className="absolute left-[-3px] top-[100px] w-[3px] h-8 bg-[#2a2a2a] rounded-l-sm" />
        <div className="absolute left-[-3px] top-[148px] w-[3px] h-12 bg-[#2a2a2a] rounded-l-sm" />
        <div className="absolute left-[-3px] top-[210px] w-[3px] h-12 bg-[#2a2a2a] rounded-l-sm" />
        {/* Side button right (power) */}
        <div className="absolute right-[-3px] top-[148px] w-[3px] h-16 bg-[#2a2a2a] rounded-r-sm" />
        {/* Screen */}
        <div className="relative bg-black rounded-[34px] overflow-hidden" style={{ aspectRatio: '393/852' }}>
          {/* Dynamic Island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[80px] h-[26px] bg-black rounded-full z-10" />
          {/* Content */}
          <div className="absolute inset-0 overflow-y-auto [&::-webkit-scrollbar]:hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

function AndroidFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-[280px] select-none">
      {/* Outer shell */}
      <div className="relative bg-[#1a1a1a] rounded-[36px] p-[10px] shadow-2xl ring-1 ring-white/10">
        {/* Side buttons right */}
        <div className="absolute right-[-3px] top-[120px] w-[3px] h-10 bg-[#2a2a2a] rounded-r-sm" />
        <div className="absolute right-[-3px] top-[170px] w-[3px] h-16 bg-[#2a2a2a] rounded-r-sm" />
        {/* Screen */}
        <div className="relative bg-[#0f0f0f] rounded-[28px] overflow-hidden" style={{ aspectRatio: '9/19.5' }}>
          {/* Punch-hole camera */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[14px] h-[14px] bg-black rounded-full z-10 ring-1 ring-[#1a1a1a]" />
          {/* Content */}
          <div className="absolute inset-0 overflow-y-auto [&::-webkit-scrollbar]:hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
