'use client';

/* Catches errors thrown at the very top of the app (root layout/providers) that
   the route-level app/error.jsx cannot. Without this, such a crash leaves a
   blank/looping page; here it degrades to a branded recovery screen and shows
   the error message so it is never silent. global-error must render its own
   <html>/<body> because it replaces the root layout. */
export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#05080a',
          color: '#fff',
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 480 }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              margin: '0 0 12px',
              background: 'linear-gradient(90deg,#90eb61,#24baac)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Something went wrong
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, fontSize: 14 }}>
            The page hit an unexpected error. Please try again - if it keeps
            happening, reach us at info@genufy.in.
          </p>
          {error?.message ? (
            <pre
              style={{
                marginTop: 16,
                padding: 12,
                fontSize: 11,
                textAlign: 'left',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                color: '#7CFFB2',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
              }}
            >
              {String(error.message)}
            </pre>
          ) : null}
          <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                borderRadius: 999,
                padding: '12px 28px',
                fontSize: 14,
                fontWeight: 600,
                color: '#000',
                border: 'none',
                cursor: 'pointer',
                background: 'linear-gradient(110deg,#90eb61 0%,#24baac 100%)',
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                borderRadius: 999,
                padding: '12px 28px',
                fontSize: 14,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.85)',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              Back to Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
