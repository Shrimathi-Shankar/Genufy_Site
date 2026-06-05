'use client';

import { useRouter } from 'next/navigation';
import CinematicContact from '../components/CinematicContact.jsx';

// Dedicated /contact route. Reuses the existing CinematicContact form (the same
// one the "Contact Us" buttons open) rendered open as a full-screen page, so
// there is a single source of truth for the form - no duplicate. Closing or
// submitting returns the visitor to the landing page.
export default function Contact() {
  const router = useRouter();
  return (
    <CinematicContact
      open
      onClose={() => router.push('/')}
      cta="Let's Build Together"
    />
  );
}
