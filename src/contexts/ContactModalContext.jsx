import { createContext, useContext, useCallback, useState } from 'react';
import CinematicContact from '../components/CinematicContact.jsx';

/* ------------------------------------------------------------------
   ContactModalContext — single source of truth for the contact form.

   One CinematicContact instance is mounted at the app root so that any
   trigger (Navbar "Contact Us", ClosingCTA "Start a conversation", …)
   opens the exact same modal. The modal itself is fixed at the maximum
   z-index, so it always renders above page content and the footer.
------------------------------------------------------------------- */
const ContactModalContext = createContext(null);

export function ContactModalProvider({ children }) {
  const [open, setOpen] = useState(false);
  const openContact = useCallback(() => setOpen(true), []);
  const closeContact = useCallback(() => setOpen(false), []);

  return (
    <ContactModalContext.Provider value={{ open, openContact, closeContact }}>
      {children}
      <CinematicContact open={open} onClose={closeContact} cta="Let's Build Together" />
    </ContactModalContext.Provider>
  );
}

export function useContactModal() {
  const ctx = useContext(ContactModalContext);
  if (!ctx) {
    throw new Error('useContactModal must be used within a ContactModalProvider');
  }
  return ctx;
}
