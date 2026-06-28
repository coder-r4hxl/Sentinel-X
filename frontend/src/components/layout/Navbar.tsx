import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Menu, ShieldCheck, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const navItems = [
  { label: 'Platform', href: '#platform' },
  { label: 'Intelligence', href: '#top' },
  { label: 'Reports', href: '#platform' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-white/10 bg-[#05070A]/80 shadow-[0_16px_55px_rgba(0,0,0,0.32)] backdrop-blur-2xl'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a
          href="#top"
          className="flex items-center gap-3 rounded-full px-2 py-1 text-sm font-semibold uppercase tracking-[0.24em] text-slate-50 transition hover:text-[#00B8FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B8FF]/70"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#00B8FF]/30 bg-[#00B8FF]/10 text-[#00B8FF] shadow-[0_0_28px_rgba(0,184,255,0.16)]">
            <ShieldCheck size={18} />
          </span>
          <span className="tracking-[0.24em]">Sentinel-X</span>
        </a>

        <nav className="hidden items-center gap-7 text-sm text-slate-300 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <motion.a
              key={item.label}
              href={item.href}
              whileHover={{ y: -1, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="relative rounded-full px-2 py-1 transition duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B8FF]/70"
            >
              {item.label}
            </motion.a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <motion.a
            href="#assessment"
            whileHover={{ y: -1, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-300 transition duration-200 hover:border-[#00B8FF]/40 hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B8FF]/70"
          >
            Explore Platform
          </motion.a>
          <motion.a
            href="#assessment"
            whileHover={{ y: -1, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 rounded-full bg-[#00B8FF] px-4 py-2 text-sm font-semibold text-[#05070A] shadow-[0_12px_35px_rgba(0,184,255,0.22)] transition duration-200 hover:bg-[#2dc8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B8FF]/70"
          >
            Begin Assessment
            <ArrowRight size={16} />
          </motion.a>
        </div>

        <button
          type="button"
          className="rounded-full border border-white/10 bg-white/[0.03] p-2.5 text-slate-200 transition hover:border-[#00B8FF]/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B8FF]/70 md:hidden"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label="Toggle navigation"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-t border-white/10 bg-[#05070A]/95 px-4 py-4 backdrop-blur-xl md:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-2 text-sm text-slate-300">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2.5 transition hover:border-[#00B8FF]/40 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#assessment"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#00B8FF] px-4 py-2.5 font-semibold text-[#05070A]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Begin Assessment
                <ArrowRight size={16} />
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
