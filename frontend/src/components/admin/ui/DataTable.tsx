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
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            {columns.map(col => (
              <th key={col.key} className={`px-4 py-3 text-left text-white/40 font-medium text-xs uppercase tracking-wide ${col.className ?? ''}`}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={String(row[keyField])} className="border-b border-white/5 hover:bg-white/3 transition-colors last:border-0">
              {columns.map(col => (
                <td key={col.key} className={`px-4 py-3 text-white/70 ${col.className ?? ''}`}>
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
