export default function Footer() {
  return (
    <footer id="contact" className="border-t border-white/10 px-4 py-10 text-sm text-slate-400 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto grid max-w-7xl gap-8 rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 md:grid-cols-[1.2fr_0.8fr] md:items-end md:p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#00B8FF]">Sentinel-X</p>
          <p className="mt-3 text-2xl font-semibold text-white">Security clarity for modern teams.</p>
          <p className="mt-3 max-w-xl leading-7 text-slate-400">
            Built for organizations that need measurable visibility, trusted reporting, and fast response coordination across the modern attack surface.
          </p>
        </div>

        <div className="flex flex-col gap-3 text-sm sm:items-end">
          <div className="flex flex-wrap items-center gap-4">
            <a href="https://github.com/sentinel-x" className="rounded-full px-2 py-1 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B8FF]/70">
              GitHub
            </a>
            <a href="#top" className="rounded-full px-2 py-1 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B8FF]/70">
              Back to top
            </a>
          </div>
          <p className="text-slate-500">Version 1.0.0 • © 2026 Sentinel-X</p>
        </div>
      </div>
    </footer>
  );
}
