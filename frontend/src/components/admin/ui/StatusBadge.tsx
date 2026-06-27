interface Props {
  status: string
  map?:   Record<string, { label: string; color: string }>
}

const DEFAULTS: Record<string, { label: string; color: string }> = {
  NEW:         { label: 'New',        color: 'bg-blue-500/20 text-blue-400' },
  READ:        { label: 'Read',       color: 'bg-white/10 text-white/50' },
  REPLIED:     { label: 'Replied',    color: 'bg-green-500/20 text-green-400' },
  ARCHIVED:    { label: 'Archived',   color: 'bg-white/5 text-white/30' },
  PUBLISHED:   { label: 'Published',  color: 'bg-green-500/20 text-green-400' },
  DRAFT:       { label: 'Draft',      color: 'bg-yellow-500/20 text-yellow-400' },
  ACTIVE:      { label: 'Active',     color: 'bg-green-500/20 text-green-400' },
  INACTIVE:    { label: 'Inactive',   color: 'bg-white/10 text-white/40' },
  SUPER_ADMIN: { label: 'Super Admin', color: 'bg-yellow-500/20 text-yellow-400' },
  EDITOR:      { label: 'Editor',     color: 'bg-brand-primary/20 text-brand-primary' },
}

export default function StatusBadge({ status, map }: Props) {
  const lookup = map ?? DEFAULTS
  const entry  = lookup[status] ?? { label: status, color: 'bg-white/10 text-white/50' }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${entry.color}`}>
      {entry.label}
    </span>
  )
}
