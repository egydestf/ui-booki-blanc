// src/app/icon.tsx
// Generates the browser-tab favicon for Rumah Literasi Tambaksogra.
// Renders the "RL" monogram on a clean white background using brand colors.
// Next.js App Router convention: this file is automatically used as the site icon.

import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "6px",
        }}
      >
        {/* Outer book-shape container */}
        <div
          style={{
            display: "flex",
            width: "26px",
            height: "26px",
            background: "linear-gradient(135deg, #0A96E6 0%, #0569ad 100%)",
            borderRadius: "5px",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 6px rgba(10,150,230,0.4)",
          }}
        >
          {/* "RL" monogram in white */}
          <span
            style={{
              color: "white",
              fontSize: "10px",
              fontWeight: "900",
              letterSpacing: "-0.5px",
              lineHeight: 1,
              fontFamily: "sans-serif",
            }}
          >
            RL
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
