interface CharCounterProps {
  current: number
  max: number
}

export function CharCounter({ current, max }: CharCounterProps) {
  const pct = current / max
  const color =
    pct >= 1
      ? 'text-red-500'
      : pct >= 0.8
      ? 'text-amber-500'
      : 'text-gray-400 dark:text-gray-500'

  return (
    <span className={`text-xs tabular-nums ${color}`}>
      {current}/{max}
    </span>
  )
}
