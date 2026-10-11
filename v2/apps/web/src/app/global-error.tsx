"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: 24,
          textAlign: "center",
          background: "#0b1537",
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h1 style={{ fontSize: 28, margin: 0 }}>TOMCARE Foundation is briefly unavailable.</h1>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.65)" }}>Please try again in a moment, or call (438) 773-3653.</p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: 12,
            height: 48,
            padding: "0 24px",
            border: 0,
            borderRadius: 999,
            color: "#0b1537",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
            background: "#e5ac1b",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
