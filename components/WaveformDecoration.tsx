interface WaveformDecorationProps {
  barCount?: number
  className?: string
  color?: string
}

export function WaveformDecoration({
  barCount = 20,
  className = '',
  color = '#FAA21B',
}: WaveformDecorationProps) {
  const bars = Array.from({ length: barCount }, (_, i) => {
    const height = 12 + Math.abs(Math.sin(i * 0.8) * 30 + Math.cos(i * 1.3) * 18)
    const delay = (i * 0.07).toFixed(2)
    const animName = i % 3 === 0 ? 'rave-pulse' : i % 3 === 1 ? 'rave-pulse-2' : 'rave-pulse-3'
    const duration = (0.8 + (i % 5) * 0.15).toFixed(2)
    return { height, delay, animName, duration }
  })

  return (
    <div
      className={`flex items-end gap-[3px] ${className}`}
      aria-hidden="true"
      role="presentation"
      suppressHydrationWarning
    >
      {bars.map((cfg, i) => (
        <div
          key={i}
          suppressHydrationWarning
          style={{
            width: '4px',
            height: `${cfg.height}px`,
            backgroundColor: color,
            borderRadius: '2px',
            opacity: 0.7,
            animation: `${cfg.animName} ${cfg.duration}s ease-in-out infinite`,
            animationDelay: `${cfg.delay}s`,
            transformOrigin: 'bottom',
          }}
        />
      ))}
    </div>
  )
}
