'use client'

import type { Course } from './CourseCard'

type Level = 'ALL' | Course['level']

const TABS: { value: Level; label: string }[] = [
  { value: 'ALL',              label: 'All' },
  { value: 'DISCOVERY',        label: 'Discovery' },
  { value: 'BEGINNER',         label: 'Beginner' },
  { value: 'INTERMEDIATE',     label: 'Intermediate' },
  { value: 'ADVANCED',         label: 'Advanced' },
  { value: 'IKO_CERTIFICATION',label: 'IKO Certification' },
]

interface Props {
  activeLevel: Level
  onChange: (level: Level) => void
}

export default function CourseLevelTabs({ activeLevel, onChange }: Props) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex gap-1 min-w-max px-4 md:px-0 py-1">
        {TABS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={[
              'px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap',
              activeLevel === value
                ? 'bg-[#1a9fd4] text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

export type { Level }
