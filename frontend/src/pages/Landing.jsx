import { useAuth } from '../context/AuthContext'
import Benefits from '../components/landing/Benefits'
import CTASection from '../components/landing/CTASection'
import DesignPhilosophy from '../components/landing/DesignPhilosophy'
import FAQSection from '../components/landing/FAQSection'
import FeaturesSection from '../components/landing/FeaturesSection'
import Footer from '../components/landing/Footer'
import GhanaSection from '../components/landing/GhanaSection'
import Hero from '../components/landing/Hero'
import HowItWorks from '../components/landing/HowItWorks'
import InsightsSection from '../components/landing/InsightsSection'
import LandingNavbar from '../components/landing/LandingNavbar'
import ProductShowcase from '../components/landing/ProductShowcase'
import SecuritySection from '../components/landing/SecuritySection'
import TrustStrip from '../components/landing/TrustStrip'

export default function Landing() {
  const { user } = useAuth()
  const isAuthed = !!user
  const userFirstName = user?.fullName?.split(' ')[0]

  return (
    <div className="bm-landing bg-white dark:bg-slate-950">
      <LandingNavbar isAuthed={isAuthed} />
      <Hero isAuthed={isAuthed} />
      <TrustStrip />
      <FeaturesSection />
      <ProductShowcase />
      <HowItWorks />
      <InsightsSection />
      <GhanaSection />
      <Benefits />
      <SecuritySection />
      <DesignPhilosophy />
      <FAQSection />
      <CTASection isAuthed={isAuthed} userFirstName={userFirstName} />
      <Footer />
    </div>
  )
}
