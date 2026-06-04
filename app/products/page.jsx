import Products from '../../src/views/Products.jsx';

export const metadata = {
  title: 'Products',
  description:
    'Explore the Genufy product atlas — GFY Books, Dev Inspector, Pharma Stock, QMS, Expense Manager, and Humora.',
  alternates: { canonical: '/products' },
};

export default function Page() {
  return <Products />;
}
