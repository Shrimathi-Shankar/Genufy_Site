import './globals.css';
import { Inter, Poppins, Space_Grotesk } from 'next/font/google';
import Providers from './providers.jsx';

// Self-hosted at build time (no render-blocking Google Fonts request, no layout
// shift). Exposed as CSS variables consumed by tailwind.config.js.
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-space',
  display: 'swap',
});

const SITE_URL = 'https://genufy.in';
const DESCRIPTION =
  'Genufy TechWorks engineers intelligent digital solutions - Salesforce expertise, AI automation, data engineering, and enterprise-grade platforms built to scale.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // Longer, keyword-rich default (the bare brand name was flagged as too short).
    default: 'Genufy TechWorks - Intelligent Digital Solutions & AI',
    template: '%s | Genufy TechWorks',
  },
  description: DESCRIPTION,
  applicationName: 'Genufy TechWorks',
  keywords: [
    'Genufy',
    'Genufy TechWorks',
    'Salesforce partner',
    'AI solutions',
    'digital transformation',
    'data engineering',
    'MuleSoft',
    'Snowflake',
    'Informatica',
    'DevOps',
    'enterprise software',
  ],
  authors: [{ name: 'Genufy TechWorks' }],
  creator: 'Genufy TechWorks',
  publisher: 'Genufy TechWorks',
  alternates: { canonical: '/' },
  icons: { icon: '/favicon.png', apple: '/favicon.png' },
  openGraph: {
    type: 'website',
    siteName: 'Genufy TechWorks',
    title: 'Genufy TechWorks',
    description: DESCRIPTION,
    url: SITE_URL,
    images: [
      { url: '/og-image.png', width: 1200, height: 630, alt: 'Genufy TechWorks - Intelligent Digital Solutions & AI' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Genufy TechWorks',
    description: DESCRIPTION,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  themeColor: '#000000',
};

/* Organization structured data (JSON-LD) - helps search engines understand the
   brand (rich results / knowledge panel signals). */
const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Genufy TechWorks',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: DESCRIPTION,
  email: 'info@genufy.in',
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+91-427-2243334',
      contactType: 'customer service',
      email: 'info@genufy.in',
      areaServed: ['IN', 'US'],
    },
  ],
  address: [
    {
      '@type': 'PostalAddress',
      addressLocality: 'Salem',
      addressRegion: 'Tamil Nadu',
      addressCountry: 'IN',
    },
    {
      '@type': 'PostalAddress',
      addressLocality: 'Coimbatore',
      addressRegion: 'Tamil Nadu',
      addressCountry: 'IN',
    },
    {
      '@type': 'PostalAddress',
      addressLocality: 'Parsippany',
      addressRegion: 'NJ',
      postalCode: '07054',
      addressCountry: 'US',
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        {/* Resource hints - warm up the connections used after first paint:
            EmailJS (contact form submit) and the external brand-logo CDNs used
            in the Manifesto network. The Spline 3D scene is served locally
            (/robot.splinecode), so it needs no preconnect. */}
        <link rel="preconnect" href="https://api.emailjs.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.emailjs.com" />
        <link rel="dns-prefetch" href="https://cdn.simpleicons.org" />
        <link rel="dns-prefetch" href="https://logo.clearbit.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
