import Products from '../../src/views/Products.jsx';

export const metadata = {
  title: 'Products',
  description:
    'Explore the Genufy TechWorks product atlas — GFY Books, Dev Inspector, Pharma Stock, QMS, Expense Manager, and Humora. Built-in-house, shipped to users.',
  alternates: { canonical: '/products' },
  openGraph: {
    title: 'Products | Genufy TechWorks',
    description:
      'Explore the Genufy TechWorks product atlas — GFY Books, Dev Inspector, Pharma Stock, QMS, Expense Manager, and Humora.',
    url: 'https://www.genufy.in/products',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Genufy TechWorks Products' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Products | Genufy TechWorks',
    description:
      'Explore the Genufy TechWorks product atlas — GFY Books, Dev Inspector, Pharma Stock, QMS, Expense Manager, and Humora.',
    images: ['/og-image.png'],
  },
};

export default function Page() {
  return <Products />;
}
