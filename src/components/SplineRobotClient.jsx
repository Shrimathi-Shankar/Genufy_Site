'use client';

import { useState } from 'react';
import Spline from '@splinetool/react-spline/next';

/* This module is the ONLY place that imports @splinetool/react-spline. It is
   loaded exclusively via next/dynamic({ ssr: false }) from HeroGenufy, so the
   Spline package (which ships only an ESM `import` export condition) never
   enters Next's server/prerender compilation — it resolves and runs only in
   the client bundle. */

const SCENE_URL = '/robot.splinecode';

function LoadingPulse() {
  return (
    <div className="absolute inset-0 grid place-items-center" aria-hidden>
      <div className="relative h-24 w-24">
        <span className="absolute inset-0 animate-ping rounded-full bg-teal/20" />
        <span
          className="absolute inset-3 rounded-full opacity-70 blur-md"
          style={{ background: 'radial-gradient(circle, #24baac, transparent 70%)' }}
        />
        <span className="absolute inset-0 rounded-full border border-lime/30 animate-spinSlow" />
      </div>
    </div>
  );
}

export default function SplineRobot() {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div aria-hidden className="absolute inset-0 grid place-items-center">
        <div
          className="h-72 w-72 rounded-full opacity-40 blur-3xl"
          style={{ background: 'radial-gradient(circle, #24baac, #90eb61 60%, transparent 75%)' }}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      {!ready && <LoadingPulse />}
      <Spline
        scene={SCENE_URL}
        onLoad={() => setReady(true)}
        onError={() => setFailed(true)}
        className={`!h-full !w-full transition-opacity duration-1000 ${
          ready ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
