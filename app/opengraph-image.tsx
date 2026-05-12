import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#D52B1E",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        {/* White card */}
        <div
          style={{
            background: "white",
            borderRadius: 32,
            width: 1100,
            height: 530,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 80px",
          }}
        >
          {/* Left: Text */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 680 }}>
            <div style={{ fontSize: 22, color: "#D52B1E", fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>
              Volksabstimmung · 14. Juni 2026
            </div>
            <div style={{ fontSize: 52, fontWeight: 800, color: "#111", lineHeight: 1.15 }}>
              Deine Stimme zählt.
            </div>
            <div style={{ fontSize: 26, color: "#555", lineHeight: 1.4 }}>
              Argumente einreichen · KI fasst zusammen · Stimmungsbarometer in Echtzeit
            </div>
            {/* Barometer preview */}
            <div style={{ display: "flex", marginTop: 8, gap: 0, borderRadius: 12, overflow: "hidden", height: 24, width: 480 }}>
              <div style={{ background: "#10b981", width: "40%" }} />
              <div style={{ background: "#f59e0b", width: "25%" }} />
              <div style={{ background: "#ef4444", width: "35%" }} />
            </div>
            <div style={{ display: "flex", gap: 24, fontSize: 18, color: "#777" }}>
              <span style={{ color: "#059669" }}>● Dafür</span>
              <span style={{ color: "#d97706" }}>● Neutral</span>
              <span style={{ color: "#dc2626" }}>● Dagegen</span>
            </div>
          </div>

          {/* Right: Swiss cross badge */}
          <div
            style={{
              width: 200,
              height: 200,
              background: "#D52B1E",
              borderRadius: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <div style={{ position: "absolute", background: "white", width: 50, height: 130, borderRadius: 8 }} />
            <div style={{ position: "absolute", background: "white", width: 130, height: 50, borderRadius: 8 }} />
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
