import Navbar from '@/components/layout/Navbar'
import HeroSection from '@/components/home/HeroSection'
import WindWidget from '@/components/home/WindWidget'
import SunTideWidget from '@/components/home/SunTideWidget'
import AboutSection from '@/components/home/AboutSection'
import ServicesSection from '@/components/home/ServicesSection'
import GalleryPreview from '@/components/home/GalleryPreview'
import LocationSection from '@/components/home/LocationSection'
import Footer from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <WindWidget />
        <SunTideWidget />
        <AboutSection />
        <ServicesSection />
        <GalleryPreview />
        <LocationSection />
      </main>
      <Footer />
    </>
  )
}
