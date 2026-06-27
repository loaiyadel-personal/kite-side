'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQ = [
  {
    q: 'Where exactly are you located?',
    a: 'We are on the beach road in Ras Sudr, South Sinai, Egypt — inside Paradise Resort. Look for the Kite Side Beach Club sign. GPS: 29.4945° N, 32.7340° E',
  },
  {
    q: 'What are your opening hours?',
    a: 'We are open daily from 9:00 AM until late. The beach club and restaurant are open year-round. Kite lessons are scheduled based on wind conditions.',
  },
  {
    q: 'How do I book a kite course?',
    a: 'Use the contact form above, WhatsApp us directly at +20 11 16407080, or visit the Courses page and click "Book Now" on any course to fill in a booking request.',
  },
]

export default function ContactFAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display font-bold text-2xl text-brand-dark text-center mb-8">
          Quick Answers
        </h2>
        <div className="flex flex-col gap-3">
          {FAQ.map(({ q, a }, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
              >
                <span className="font-medium text-brand-dark text-sm">{q}</span>
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
