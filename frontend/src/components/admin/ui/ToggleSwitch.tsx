'use client'

interface Props {
  checked:   boolean
  onChange:  (v: boolean) => void
  disabled?: boolean
  label?:    string
}

export default function ToggleSwitch({ checked, onChange, disabled, label }: Props) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed ${
          checked ? 'bg-brand-primary' : 'bg-white/20'
        }`}>
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`} />
      </button>
      {label && <span className="text-sm text-white/60">{label}</span>}
    </label>
  )
}
