import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#D52B1E",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 6,
        }}
      >
        {/* Swiss cross - vertical bar */}
        <div style={{ position: "absolute", background: "white", width: 7, height: 19, borderRadius: 1 }} />
        {/* Swiss cross - horizontal bar */}
        <div style={{ position: "absolute", background: "white", width: 19, height: 7, borderRadius: 1 }} />
      </div>
    ),
    { width: 32, height: 32 }
  );
}
