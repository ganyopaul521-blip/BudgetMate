import { useAuth } from '../context/AuthContext'
import accraSkyline from '../assets/images/accra-skyline.jpg'
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
    <div className="bm-landing relative overflow-hidden bg-white dark:bg-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[26rem] overflow-hidden" aria-hidden="true">
        <img src={accraSkyline} alt="" className="absolute right-0 top-0 h-full w-full max-w-4xl object-cover object-[65%_30%] opacity-[0.4] dark:opacity-[0.28]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-slate-950" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white dark:to-slate-950" />
      </div>
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
