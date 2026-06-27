import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ContactHero from '@/components/contact/ContactHero'
import ContactForm from '@/components/contact/ContactForm'
import ContactInfo from '@/components/contact/ContactInfo'
import SocialLinks from '@/components/contact/SocialLinks'
import ContactMap from '@/components/contact/ContactMap'
import ContactFAQ from '@/components/contact/ContactFAQ'

export const metadata = {
  title: 'Contact Us — Kite Side Beach Club',
  description: 'Get in touch with Kite Side Beach Club in Ras Sudr, Egypt. Questions about kite courses, restaurant reservations, or beach club access.',
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <ContactHero />

        {/* Form + Info two-column layout */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              {/* Form — 60% */}
              <div className="lg:col-span-3">
                <h2 className="font-display font-bold text-2xl text-brand-dark mb-6">Send a Message</h2>
                <ContactForm />
              </div>
              {/* Info — 40% */}
              <div className="lg:col-span-2">
                <ContactInfo />
              </div>
            </div>
          </div>
        </section>

        <SocialLinks />
        <ContactMap />
        <ContactFAQ />
      </main>
      <Footer />
    </>
  )
}
