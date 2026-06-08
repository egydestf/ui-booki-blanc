// src/app/icon.tsx
// Generates the browser-tab favicon for Rumah Literasi Tambaksogra.
// Uses the Booki mascot inside a branded pink→blue gradient container.
// Next.js App Router convention: this file is automatically used as the site icon.
//
// WHY NODE RUNTIME (not edge):
//   ImageResponse / Satori cannot fetch external URLs on the fly during render.
//   We must pre-load the image as a base64 data URI before passing it to JSX.
//   fs.readFileSync is the reliable way to do this — requires the Node runtime.

import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

// Switch to Node runtime so we can use fs to read the mascot image.
export const runtime = "nodejs";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  // Read booki_icon.webp from /public/images/ at build/request time.
  // path.join(process.cwd(), "public", ...) is the standard pattern for
  // reading public assets in Next.js Server Components / Route Handlers.
  const imgBuffer = readFileSync(
    join(process.cwd(), "public", "images", "booki_icon.webp")
  );
  const base64 = imgBuffer.toString("base64");
  // Satori supports PNG and JPEG natively; WebP works when passed as a data URI.
  const dataUrl = `data:image/webp;base64,${base64}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        {/* Branded gradient container — pink → blue, matches Booki theme */}
        <div
          style={{
            display: "flex",
            width: "32px",
            height: "32px",
            background: "linear-gradient(135deg, #E9559B 0%, #0A96E6 100%)",
            borderRadius: "8px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={dataUrl}
            alt="Booki"
            width="24"
            height="24"
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}