import './globals.css';
import Providers from './providers.jsx';

const SITE_URL = 'https://genufy.in';
const DESCRIPTION =
  'Genufy TechWorks engineers intelligent digital solutions — Salesforce expertise, AI automation, data engineering, and enterprise-grade platforms built to scale.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Genufy TechWorks',
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
    images: [{ url: '/logo.png', alt: 'Genufy TechWorks' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Genufy TechWorks',
    description: DESCRIPTION,
    images: ['/logo.png'],
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

/* Organization structured data (JSON-LD) — helps search engines understand the
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@700;800&family=Space+Grotesk:wght@500;700&display=swap"
          rel="stylesheet"
        />
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
