interface Props { password: string }

function score(p: string) {
  if (!p) return 0
  let s = 0
  if (p.length >= 8)           s++
  if (/[A-Z]/.test(p))         s++
  if (/[0-9]/.test(p))         s++
  if (/[^a-zA-Z0-9]/.test(p)) s++
  return s
}

const LEVELS = [
  { label: 'Weak',     color: 'bg-red-500' },
  { label: 'Fair',     color: 'bg-orange-400' },
  { label: 'Good',     color: 'bg-yellow-400' },
  { label: 'Strong',   color: 'bg-green-400' },
]

export default function PasswordStrength({ password }: Props) {
  if (!password) return null
  const s = score(password)
  const level = LEVELS[s - 1] ?? LEVELS[0]
  return (
    <div className="mt-1.5 space-y-1">
      <div className="flex gap-1 h-1">
        {LEVELS.map((l, i) => (
          <div key={l.label} className={`flex-1 rounded-full transition-colors ${i < s ? level.color : 'bg-white/10'}`} />
        ))}
      </div>
      <p className="text-xs text-white/40">{level.label}</p>
    </div>
  )
}
