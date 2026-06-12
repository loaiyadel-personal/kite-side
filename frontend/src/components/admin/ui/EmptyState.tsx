import { ReactNode } from 'react'

interface Props {
  icon?:    string
  title:    string
  message?: string
  action?:  ReactNode
}

export default function EmptyState({ icon = '📭', title, message, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4 opacity-50">{icon}</div>
      <h3 className="text-white font-semibold text-lg mb-1">{title}</h3>
      {message && <p className="text-white/40 text-sm max-w-xs mb-5">{message}</p>}
      {action && <div>{action}</div>}
    </div>
  )
}
