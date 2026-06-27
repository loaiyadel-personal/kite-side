'use client'

import { useState, useEffect, useRef } from 'react'

const FILTERS = [
  { label: 'All',                targetId: null },
  { label: 'Breakfast',          targetId: 'breakfast' },
  { label: 'Appetizers',         targetId: 'appetizers' },
  { label: 'Salads',             targetId: 'salads' },
  { label: 'Sandwiches & Wraps', targetId: 'sandwiches-wraps' },
  { label: 'Pizza',              targetId: 'pizza' },
  { label: 'Pasta',              targetId: 'pasta' },
  { label: 'Burgers',            targetId: 'burgers' },
  { label: 'Main Courses',       targetId: 'main-courses' },
  { label: 'Coffee',             targetId: 'coffee-hot' },
  { label: 'Milkshakes',         targetId: 'milkshakes' },
  { label: 'Juices & Smoothies', targetId: 'fresh-juices' },
  { label: 'Hot Drinks',         targetId: 'hot-drinks' },
  { label: 'Soft Drinks',        targetId: 'soft-drinks' },
]

export default function MenuFilterBar() {
  const [active, setActive] = useState<string | null>(null)
  const barRef = useRef<HTMLDivElement>(null)

  const handleClick = (targetId: string | null, label: string) => {
    setActive(label)
    if (!targetId) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const el = document.getElementById(targetId)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Highlight active section on scroll via IntersectionObserver
  useEffect(() => {
    const ids = FILTERS.filter((f) => f.targetId).map((f) => f.targetId as string)
    const observers: IntersectionObserver[] = []
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(FILTERS.find((f) => f.targetId === id)?.label ?? null) },
        { rootMargin: '-40% 0px -55% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <div
      ref={barRef}
      className="sticky z-40 bg-white border-b border-gray-200 shadow-sm"
      style={{ top: '64px' }}
    >
      <div
        className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide max-w-6xl mx-auto"
        style={{ scrollbarWidth: 'none' }}
      >
        {FILTERS.map(({ label, targetId }) => (
          <button
            key={label}
            onClick={() => handleClick(targetId, label)}
            className={`flex-none px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              active === label
                ? 'text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            style={active === label ? { backgroundColor: '#1a9fd4' } : {}}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
