import { Clock, Users, Check, MessageCircle, Target } from 'lucide-react'

export interface Course {
  id: string
  level: 'DISCOVERY' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'IKO_CERTIFICATION' | 'INSTRUCTOR'
  name: string
  description: string
  outcome?: string | null
  durationHours: number
  maxStudents: number
  priceEGP: number | string
  priceUSD?: number | string | null
  includes: string[]
}

const LEVEL_BADGE: Record<Course['level'], { label: string; cls: string }> = {
  DISCOVERY:        { label: 'Discovery',         cls: 'bg-green-100 text-green-800' },
  BEGINNER:         { label: 'Beginner',           cls: 'bg-teal-100 text-teal-800' },
  INTERMEDIATE:     { label: 'Intermediate',       cls: 'bg-blue-100 text-blue-800' },
  ADVANCED:         { label: 'Advanced',           cls: 'bg-orange-100 text-orange-800' },
  IKO_CERTIFICATION:{ label: 'IKO Certification',  cls: 'bg-amber-100 text-amber-800' },
  INSTRUCTOR:       { label: 'Instructor',         cls: 'bg-purple-100 text-purple-800' },
}

interface Props {
  course: Course
  onBook: (course: Course) => void
}

export default function CourseCard({ course, onBook }: Props) {
  const badge = LEVEL_BADGE[course.level]
  const price = typeof course.priceEGP === 'string' ? parseFloat(course.priceEGP) : course.priceEGP
  const priceUsd = course.priceUSD != null
    ? (typeof course.priceUSD === 'string' ? parseFloat(course.priceUSD) : course.priceUSD)
    : null

  const waMsg = encodeURIComponent(`Hi! I'm interested in the ${course.name} course`)
  const waLink = `https://wa.me/201116407080?text=${waMsg}`

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="bg-[#022b3d] px-6 pt-6 pb-5">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-3 ${badge.cls}`}>
          {badge.label}
        </span>
        <h3 className="font-outfit font-bold text-xl text-white leading-snug">{course.name}</h3>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-6 gap-5">
        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{course.description}</p>

        {/* Key info */}
        <div className="flex items-center gap-5 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <Clock size={15} className="text-[#1a9fd4]" />
            {course.durationHours}h
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={15} className="text-[#1a9fd4]" />
            Max {course.maxStudents}
          </span>
        </div>

        {/* Includes */}
        {course.includes.length > 0 && (
          <ul className="grid grid-cols-1 gap-1">
            {course.includes.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                <Check size={14} className="text-[#1a9fd4] flex-none" />
                {item}
              </li>
            ))}
          </ul>
        )}

        {/* Outcome */}
        {course.outcome && (
          <div className="flex items-start gap-2 bg-teal-50 rounded-xl p-3 text-sm text-teal-800">
            <Target size={15} className="flex-none mt-0.5 text-teal-600" />
            <span><strong>You will achieve:</strong> {course.outcome}</span>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price */}
        <div className="border-t border-gray-100 pt-4 flex items-end justify-between gap-3">
          <div>
            <div className="font-outfit font-bold text-3xl text-[#022b3d]">
              {price.toLocaleString('en-EG')} <span className="text-lg font-normal text-gray-400">EGP</span>
            </div>
            {priceUsd != null && (
              <div className="text-sm text-gray-400">~${priceUsd} USD</div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={() => onBook(course)}
              className="bg-[#1a9fd4] hover:bg-[#0a8cc0] text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
            >
              Book Now
            </button>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#25d366] transition-colors"
            >
              <MessageCircle size={13} />
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
