export default function SiteFooter() {
  const cols = [
    { title: 'Services', items: ['Salesforce Cloud', 'Data & AI', 'Automation', 'Integrations'] },
    { title: 'Products', items: ['Agentforce', 'Einstein', 'Data Cloud', 'Experience Cloud'] },
    { title: 'Insights', items: ['Articles', 'Case Studies', 'Playbooks', 'Events'] },
    { title: 'Company', items: ['About', 'Careers', 'Contact', 'Press'] },
  ];

  return (
    <footer className="relative border-t border-white/5 bg-ink">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <a href="/" className="flex items-center gap-3">
            <span className="grid place-items-center h-10 w-10 rounded-xl bg-black ring-glow">
              <span className="font-display font-bold text-gradient-gt">G</span>
            </span>
            <span className="font-display text-xl">Genu<span className="text-gradient-gt">fy</span></span>
          </a>
          <p className="mt-5 text-white/60 max-w-sm text-sm leading-relaxed">
            Powering the Next Era of Intelligent Transformation.
          </p>
        </div>

        {cols.map((c) => (
          <div key={c.title} className="md:col-span-2">
            <div className="text-[10px] tracking-[0.4em] uppercase text-white/40 mb-4">{c.title}</div>
            <ul className="space-y-3">
              {c.items.map((it) => (
                <li key={it}>
                  <a href="#" className="text-sm text-white/75 hover:text-white transition">{it}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex flex-wrap items-center justify-between gap-3 text-xs text-white/40">
          <span>© {new Date().getFullYear()} Genufy. All rights reserved.</span>
          <span className="tracking-[0.3em] uppercase">Engineered with motion</span>
        </div>
      </div>
    </footer>
  );
}
