// src/app/icon.tsx
// Generates the browser-tab favicon for Rumah Literasi Tambaksogra.
// Uses the Booki mascot inside a branded pink→blue gradient container.
// Next.js App Router convention: this file is automatically used as the site icon.
//
// WHY NODE RUNTIME (not edge):
//   ImageResponse / Satori cannot fetch external URLs on the fly during render.
//   We must pre-load the image as a base64 data URI before passing it to JSX.
//   fs.readFileSync is the reliable way to do this — requires the Node runtime.
//
// WHY SHARP:
//   Satori (the rendering engine inside ImageResponse) does NOT support WebP
//   images, even when passed as a data URI — it throws "u2 is not iterable".
//   We use sharp to convert the WebP → PNG buffer at request time so Satori
//   receives a format it can decode.

import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";
import sharp from "sharp";

// Switch to Node runtime so we can use fs + sharp (both require Node APIs).
export const runtime = "nodejs";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  // Read booki_icon.webp from /public/images/ at build/request time.
  const webpBuffer = readFileSync(
    join(process.cwd(), "public", "logo.webp")
  );

  // Convert WebP → PNG so Satori can decode it.
  // Resize to 24×24 while we're here (the slot inside the 32px icon container).
  const pngBuffer = await sharp(webpBuffer)
    .resize(24, 24, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const base64 = pngBuffer.toString("base64");
  const dataUrl = `data:image/png;base64,${base64}`;

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
            width={24}
            height={24}
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}