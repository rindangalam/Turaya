import { ImageResponse } from "next/og";

export const runtime = "nodejs";

const CORMORANT_BOLD_URL =
  "https://fonts.gstatic.com/s/cormorantgaramond/v21/co3umX5slCNuHLi8bLeY9MK7whWMhyjypVO7abI26QOD_s06GnM.ttf";
const FIGTREE_MEDIUM_URL =
  "https://fonts.gstatic.com/s/figtree/v9/_Xmz-HUzqDCFdgfMsYiV_F7wfS-Bs_dNQF5e.ttf";

let cachedFonts: { cormorant: ArrayBuffer; figtree: ArrayBuffer } | null = null;

async function loadFonts() {
  if (cachedFonts) return cachedFonts;
  const [cormorant, figtree] = await Promise.all([
    fetch(CORMORANT_BOLD_URL).then((res) => res.arrayBuffer()),
    fetch(FIGTREE_MEDIUM_URL).then((res) => res.arrayBuffer()),
  ]);
  cachedFonts = { cormorant, figtree };
  return cachedFonts;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") ?? "Turaya").slice(0, 90);
  const overline = searchParams.get("overline") ?? "AROMA DARI NEGERI SENDIRI";

  const fonts = await loadFonts().catch(() => null);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          backgroundColor: "#0b0b0c",
          color: "#f5f2ec",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span
            style={{
              fontSize: 36,
              fontWeight: 500,
              letterSpacing: 6,
              color: "#d4b577",
              fontFamily: "Figtree",
            }}
          >
            TURAYA
          </span>
          <span
            style={{
              height: 1,
              flex: 1,
              backgroundColor: "#d4b577",
              opacity: 0.35,
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            gap: 20,
            maxWidth: 900,
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 500,
              letterSpacing: 4,
              color: "#d4b577",
              fontFamily: "Figtree",
            }}
          >
            {overline}
          </div>
          <div
            style={{
              fontSize: 62,
              lineHeight: 1.1,
              color: "#f5f2ec",
              fontFamily: "CormorantGaramond",
            }}
          >
            {title}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        ...(fonts?.cormorant
          ? [{ name: "CormorantGaramond", data: fonts.cormorant, weight: 500 as const }]
          : []),
        ...(fonts?.figtree
          ? [{ name: "Figtree", data: fonts.figtree, weight: 500 as const }]
          : []),
      ],
    },
  );
}
