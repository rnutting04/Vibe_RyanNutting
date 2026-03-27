type SpinnerProps = {
  size?: number
  color?: string
  track?: string
}

export default function Spinner({
  size = 18,
  color = '#1d4ed8',
  track = '#cbd5e1',
}: SpinnerProps) {
  const radius = 9
  const circumference = 2 * Math.PI * radius

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{
        display: 'block',
        animation: 'spin 0.8s linear infinite',
      }}
    >
      <circle
        cx="12"
        cy="12"
        r={radius}
        fill="none"
        stroke={track}
        strokeWidth="3"
      />
      <circle
        cx="12"
        cy="12"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={`${circumference * 0.68} ${circumference}`}
      />
    </svg>
  )
}