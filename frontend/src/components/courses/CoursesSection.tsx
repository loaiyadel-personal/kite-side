'use client'

import { useState } from 'react'
import CourseLevelTabs, { type Level } from './CourseLevelTabs'
import CourseCard, { type Course } from './CourseCard'
import BookingModal from './BookingModal'

interface Props {
  courses: Course[]
}

export default function CoursesSection({ courses }: Props) {
  const [activeLevel, setActiveLevel] = useState<Level>('ALL')
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  const visible = activeLevel === 'ALL'
    ? courses
    : courses.filter(c => c.level === activeLevel)

  return (
    <>
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display font-bold text-3xl text-brand-dark text-center mb-4">
            Our Courses
          </h2>
          <p className="text-gray-500 text-center mb-8 max-w-xl mx-auto">
            All courses include equipment. IKO certifications issued upon completion.
          </p>

          <div className="mb-8 flex justify-center">
            <CourseLevelTabs activeLevel={activeLevel} onChange={setActiveLevel} />
          </div>

          {visible.length === 0 ? (
            <p className="text-center text-gray-400 py-12">No courses found for this level.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map(course => (
                <CourseCard key={course.id} course={course} onBook={setSelectedCourse} />
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedCourse && (
        <BookingModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
      )}
    </>
  )
}
