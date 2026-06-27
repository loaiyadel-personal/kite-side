import { ReactNode } from 'react'

export interface Column<T> {
  key:       string
  label:     string
  render?:   (row: T) => ReactNode
  className?: string
}

interface Props<T> {
  columns:  Column<T>[]
  data:     T[]
  keyField: keyof T
}

export default function DataTable<T>({ columns, data, keyField }: Props<T>) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/[0.08]" style={{ background: 'rgba(255,255,255,0.03)' }}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.08]">
            {columns.map(col => (
              <th
                key={col.key}
                className={`px-5 py-3.5 text-left text-white/35 font-semibold text-xs uppercase tracking-wider ${col.className ?? ''}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr
              key={String(row[keyField])}
              className="border-b border-white/[0.05] last:border-0 transition-colors duration-100 hover:bg-white/[0.04]"
            >
              {columns.map(col => (
                <td
                  key={col.key}
                  className={`px-5 py-3.5 text-white/65 ${col.className ?? ''}`}
                >
                  {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
