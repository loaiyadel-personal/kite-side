import Navbar from '@/components/layout/Navbar'
import HeroSection from '@/components/home/HeroSection'
import WindWidget from '@/components/home/WindWidget'
import AboutSection from '@/components/home/AboutSection'
import ServicesSection from '@/components/home/ServicesSection'
import GalleryPreview from '@/components/home/GalleryPreview'
import ShopPreview from '@/components/home/ShopPreview'
import LocationSection from '@/components/home/LocationSection'
import WaveDivider from '@/components/home/WaveDivider'
import Footer from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <WindWidget />
        {/* white → dark transition */}
        <WaveDivider topColor="white" bottomColor="#022b3d" />
        <AboutSection />
        {/* dark → brand-surface transition */}
        <WaveDivider topColor="#022b3d" bottomColor="#EEF7F9" />
        <ServicesSection />
        {/* brand-surface → dark transition */}
        <WaveDivider topColor="#EEF7F9" bottomColor="#022b3d" />
        <GalleryPreview />
        {/* dark → brand-surface transition */}
        <WaveDivider topColor="#022b3d" bottomColor="#EEF7F9" />
        <ShopPreview />
        {/* brand-surface → white transition */}
        <WaveDivider topColor="#EEF7F9" bottomColor="white" />
        <LocationSection />
      </main>
      <Footer />
    </>
  )
}
