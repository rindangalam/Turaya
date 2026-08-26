import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DailyActivity } from "@/services/dashboard";

const W = 560;
const H = 220;
const PAD = { top: 14, right: 14, bottom: 28, left: 36 };

/**
 * "Aktivitas konten" — line chart over the last 7 days of audit-log events.
 * Pure server-rendered SVG; no client JS. Colors come from the admin theme
 * tokens (chart-1, border) so it follows the .admin palette.
 */
export function ActivityChart({ data }: { data: DailyActivity[] }) {
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const rawMax = Math.max(...data.map((d) => d.count), 0);
  const yMax = Math.max(4, Math.ceil(rawMax / 4) * 4);
  const total = data.reduce((sum, d) => sum + d.count, 0);

  const x = (index: number) =>
    PAD.left + (data.length <= 1 ? innerW / 2 : (index * innerW) / (data.length - 1));
  const y = (value: number) => PAD.top + innerH - (value / yMax) * innerH;

  const points = data.map((d, i) => `${x(i)},${y(d.count)}`).join(" ");
  const areaPath = `M ${x(0)},${PAD.top + innerH} L ${data
    .map((d, i) => `${x(i)},${y(d.count)}`)
    .join(" L ")} L ${x(data.length - 1)},${PAD.top + innerH} Z`;

  const gridValues = [0.25, 0.5, 0.75, 1].map((fraction) => Math.round(yMax * fraction));

  return (
    <Card className="h-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Aktivitas konten</CardTitle>
        <CardDescription>Log aksi staf selama 7 hari terakhir.</CardDescription>
        <CardAction>
          <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium tabular-nums text-muted-foreground">
            {total} aksi
          </span>
        </CardAction>
      </CardHeader>
      <CardContent className="relative flex flex-1 items-center">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={`Grafik jumlah aksi staf per hari selama tujuh hari terakhir, total ${total} aksi`}
          className="w-full"
        >
          {gridValues.map((value) => (
            <g key={value}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={y(value)}
                y2={y(value)}
                className="stroke-border"
                strokeDasharray="3 4"
              />
              <text x={PAD.left - 8} y={y(value) + 4} textAnchor="end" className="fill-muted-foreground text-[10px]">
                {value}
              </text>
            </g>
          ))}
          <line
            x1={PAD.left}
            x2={W - PAD.right}
            y1={y(0)}
            y2={y(0)}
            className="stroke-border"
          />

          {rawMax > 0 ? (
            <>
              <path d={areaPath} className="fill-chart-1/5" />
              <polyline
                points={points}
                fill="none"
                className="stroke-chart-1"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {data.map((d, i) => (
                <circle
                  key={d.date}
                  cx={x(i)}
                  cy={y(d.count)}
                  r="3.5"
                  className="fill-card stroke-chart-1"
                  strokeWidth="2"
                />
              ))}
            </>
          ) : null}

          {data.map((d, i) => (
            <text key={d.date} x={x(i)} y={H - 8} textAnchor="middle" className="fill-muted-foreground text-[10px]">
              {d.label}
            </text>
          ))}
        </svg>

        {rawMax === 0 ? (
          <p className="absolute inset-x-0 top-1/3 text-center text-sm text-muted-foreground">
            Belum ada aktivitas dalam 7 hari terakhir.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
