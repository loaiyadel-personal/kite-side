'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQ = [
  {
    q: 'Do I need experience to start?',
    a: 'No experience needed for the Discovery or Beginner course. We start from zero — kite theory, safety systems, and your first flights on the beach before you ever enter the water.',
  },
  {
    q: 'What is the minimum age?',
    a: 'Minimum age is 12 years with parent or guardian consent. Younger participants may be considered on a case-by-case basis after a consultation.',
  },
  {
    q: 'What should I bring?',
    a: 'Swimwear, sunscreen (SPF 50+), sunglasses with a strap, and a towel. We provide all the kitesurfing equipment — kite, board, harness, helmet, and wetsuit if needed.',
  },
  {
    q: 'How many students per instructor?',
    a: 'Maximum 3 students for beginner courses, ensuring each student gets personalized attention. Advanced and intermediate sessions allow up to 4 per instructor.',
  },
  {
    q: 'What language are lessons in?',
    a: 'Arabic and English. Other languages may be available on request — contact us to check availability.',
  },
  {
    q: 'Is kitesurfing dangerous?',
    a: 'With proper instruction it is very safe. We follow IKO safety protocols, use all safety equipment, and only teach in suitable wind and water conditions. Ras Sudr\'s flat shallow lagoon is one of the safest learning environments in the world.',
  },
]

export default function CoursesFAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-outfit font-bold text-3xl text-[#022b3d] text-center mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-500 text-center mb-10">
          Everything you need to know before you fly.
        </p>

        <div className="flex flex-col gap-3">
          {FAQ.map(({ q, a }, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
              >
                <span className="font-medium text-[#022b3d] text-sm">{q}</span>
                <ChevronDown
                  size={18}
                  className={`text-gray-400 flex-none transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                  {a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
