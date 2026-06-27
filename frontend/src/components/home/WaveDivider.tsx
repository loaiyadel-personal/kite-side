interface Props {
  topColor:    string
  bottomColor: string
  flip?:       boolean
  className?:  string
}

export default function WaveDivider({ topColor, bottomColor, flip = false, className = '' }: Props) {
  return (
    <div className={`relative w-full overflow-hidden leading-none ${className}`} style={{ backgroundColor: bottomColor }}>
      <svg
        viewBox="0 0 1440 80"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className={`block w-full h-16 md:h-20 ${flip ? 'scale-y-[-1]' : ''}`}
        aria-hidden="true"
      >
        <path
          d="M0,40 C120,80 240,0 360,40 C480,80 600,0 720,40 C840,80 960,0 1080,40 C1200,80 1320,0 1440,40 L1440,80 L0,80 Z"
          fill={topColor}
        />
      </svg>
    </div>
  )
}
