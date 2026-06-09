import Careers from '../../src/views/Careers.jsx';

export const metadata = {
  title: 'Careers',
  description:
    'Career opportunities at Genufy TechWorks. No open roles right now, but we are always interested in connecting with talented people - share your details and resume.',
  alternates: { canonical: '/careers' },
};

export default function Page() {
  return <Careers />;
}
