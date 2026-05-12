import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#D52B1E",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 40,
          gap: 0,
        }}
      >
        {/* Swiss cross */}
        <div style={{ position: "absolute", background: "white", width: 38, height: 100, borderRadius: 5 }} />
        <div style={{ position: "absolute", background: "white", width: 100, height: 38, borderRadius: 5 }} />
      </div>
    ),
    { width: 180, height: 180 }
  );
}
