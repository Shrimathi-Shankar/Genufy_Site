import SiteFooter from '../components/SiteFooter.jsx';

export default function RootLayout({ children }) {
  return (
    <div className="relative min-h-screen bg-ink">
      {children}
      {/* Global footer — appears consistently on every routed page. Service
          overlays render their own footer inside ServiceFullscreen. */}
      <SiteFooter />
    </div>
  );
}
