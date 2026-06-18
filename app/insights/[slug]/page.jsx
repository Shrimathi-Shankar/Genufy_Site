import { POSTS } from '../../../src/components/insightsData.js';
import InsightPost from '../../../src/views/InsightPost.jsx';

export async function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const post = POSTS.find((p) => p.slug === params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/insights/${post.slug}` },
  };
}

export default function Page({ params }) {
  return <InsightPost slug={params.slug} />;
}
