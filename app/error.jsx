'use client';

/* Route-level error boundary. If a client error escapes a component, this shows
   a branded recovery screen instead of Next's generic "Application error" white
   screen, and offers a reset. */
export default function Error({ error, reset }) {
  return (
    <main className="grid min-h-screen place-items-center bg-ink px-6 text-center">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          <span className="text-gradient-gt">Something went wrong</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/55">
          The page hit an unexpected error. Please try again — if it keeps
          happening, reach us at info@genufy.in.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-full px-7 py-3 text-sm font-semibold text-black transition hover:brightness-110"
            style={{ background: 'linear-gradient(110deg, #90eb61 0%, #24baac 100%)' }}
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-full border border-white/20 px-7 py-3 text-sm font-medium text-white/85 transition hover:bg-white/[0.05]"
          >
            Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}
