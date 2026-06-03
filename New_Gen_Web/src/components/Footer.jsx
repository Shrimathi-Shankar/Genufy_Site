import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 mt-10">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span className="h-7 w-7 rounded-lg bg-gradient-to-br from-accent to-accent2" />
            <span className="h-display text-lg">
              New<span className="gradient-text">Gen</span>
            </span>
          </Link>
          <p className="text-white/55 text-sm mt-3 max-w-sm">
            Crafted for builders who want the modern web — fast, fluid, and unforgettable.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-10 gap-y-4 text-sm">
          <div>
            <div className="text-white/40 uppercase tracking-widest text-xs mb-3">Product</div>
            <ul className="space-y-2 text-white/75">
              <li><a href="#" className="hover:text-white transition">Features</a></li>
              <li><a href="#" className="hover:text-white transition">Pricing</a></li>
            </ul>
          </div>
          <div>
            <div className="text-white/40 uppercase tracking-widest text-xs mb-3">Company</div>
            <ul className="space-y-2 text-white/75">
              <li><Link to="/about" className="hover:text-white transition">About</Link></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 py-5 text-center text-xs text-white/40">
        © {new Date().getFullYear()} New Gen Web. All rights reserved.
      </div>
    </footer>
  );
}
