// Code-split Framer Motion feature bundle for LazyMotion.
//
// `domMax` (not `domAnimation`) because the site uses shared-element layout
// transitions (`layoutId` on the service cards / nav pill / ServiceShowcase) and
// `layout` animations, which live in the projection code that only `domMax`
// includes. Loaded via a dynamic import in providers.jsx so this ~chunk is
// fetched after hydration instead of shipping in the initial bundle, while the
// lightweight `m` component (aliased to `motion` everywhere) stays in first load.
import { domMax } from 'framer-motion';

export default domMax;
