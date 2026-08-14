import { ImageResponse } from "next/og";

export const runtime = "nodejs";

const FRAUNCES_MEDIUM_URL =
  "https://fonts.gstatic.com/s/fraunces/v38/6NUh8FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk_WBq8U_9v0c2Wa0K7iN7hzFUPJH58nib1603gg7S2nfgRYIchRujDg.ttf";
const INTER_MEDIUM_URL =
  "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fMZg.ttf";

let cachedFonts: { fraunces: ArrayBuffer; inter: ArrayBuffer } | null = null;

async function loadFonts() {
  if (cachedFonts) return cachedFonts;
  const [fraunces, inter] = await Promise.all([
    fetch(FRAUNCES_MEDIUM_URL).then((res) => res.arrayBuffer()),
    fetch(INTER_MEDIUM_URL).then((res) => res.arrayBuffer()),
  ]);
  cachedFonts = { fraunces, inter };
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
          backgroundColor: "#f4eee3",
          color: "#3e2c22",
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
              color: "#b4552d",
              fontFamily: "Inter",
            }}
          >
            TURAYA
          </span>
          <span
            style={{
              height: 1,
              flex: 1,
              backgroundColor: "#b4552d",
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
              color: "#b4552d",
              fontFamily: "Inter",
            }}
          >
            {overline}
          </div>
          <div
            style={{
              fontSize: 62,
              lineHeight: 1.1,
              color: "#3e2c22",
              fontFamily: "Fraunces",
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
        ...(fonts?.fraunces
          ? [{ name: "Fraunces", data: fonts.fraunces, weight: 500 as const }]
          : []),
        ...(fonts?.inter
          ? [{ name: "Inter", data: fonts.inter, weight: 500 as const }]
          : []),
      ],
    },
  );
}
