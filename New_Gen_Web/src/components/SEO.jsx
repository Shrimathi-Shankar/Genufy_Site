import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, path = '/' }) {
  const fullTitle = title ? `${title} — New Gen Web` : 'New Gen Web';
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={path} />
      <link rel="canonical" href={path} />
    </Helmet>
  );
}
