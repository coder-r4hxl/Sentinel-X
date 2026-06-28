import Footer from '../../components/layout/Footer';
import Navbar from '../../components/layout/Navbar';
import FeatureCards from '../../components/landing/FeatureCards';
import Hero from '../../components/landing/Hero';

export default function LandingPage() {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#05070A] text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,184,255,0.08),_transparent_34%),radial-gradient(circle_at_80%_0%,_rgba(20,241,149,0.06),_transparent_24%)]" />
      <Navbar />
      <main>
        <Hero />
        <FeatureCards />
      </main>
      <Footer />
    </div>
  );
}
