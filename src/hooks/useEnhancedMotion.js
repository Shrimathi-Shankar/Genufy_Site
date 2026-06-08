'use client';

import { useEffect, useState } from 'react';

/* Gate heavy visual effects (the Spline 3D robot, canvas particle fields) so
   they only run on capable devices - keeping mobiles and low-end laptops from
   freezing.

   Starts `false` so the server-prerendered HTML and the first client paint
   match (no hydration mismatch); upgrades to `true` after mount only when the
   device is a wide screen, has enough CPU cores, and the user hasn't asked for
   reduced motion. */
export default function useEnhancedMotion() {
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    const reduced =
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
    const wideEnough = window.innerWidth >= 1024;
    const cores = navigator.hardwareConcurrency || 4;
    // Never enable the WebGL robot + canvas particles on touch devices. Width
    // alone let iPads through (iPadOS reports as desktop Safari and is >=1024px
    // in landscape), where the heavy GPU work risks the iOS memory crash loop.
    const coarse = window.matchMedia?.('(pointer: coarse)')?.matches ?? false;
    const touch = (navigator.maxTouchPoints || 0) > 1;
    if (wideEnough && !reduced && cores >= 4 && !coarse && !touch) {
      setEnhanced(true);
    }
  }, []);

  return enhanced;
}
