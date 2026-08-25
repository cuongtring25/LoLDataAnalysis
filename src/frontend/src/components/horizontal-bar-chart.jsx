/**

interface DataRow {
  player: string;
  value: number;
  team: 'left' | 'right';
}

interface HorizontalBarChartProps {
  rows: DataRow[];
}
**/
export default function HorizontalBarChart({ rows }) {
  const maxValue = Math.max(...rows.map((row) => row.value), 1);

  return (
    <div className="space-y-3">
      {rows.map((row, index) => {
        const percentage = (row.value / maxValue) * 100;
        const isLeft = row.team === "left";
        const color = isLeft
          ? "var(--dashboard-blue)"
          : "var(--dashboard-yellow)";

        return (
          <div key={index} className="flex items-center gap-4">
            {/* Player name - left aligned for left team, right aligned for right team */}
            <div
              className={`flex items-center gap-2 ${isLeft ? "text-left" : "text-right order-3"}`}
              style={{
                color: "var(--dashboard-text-primary)",
                fontSize: "14px",
                fontWeight: 500,
                minWidth: "100px",
              }}
            >
              {!isLeft && row.iconUrl && (
                <img
                  src={row.iconUrl}
                  alt={row.championName || "Champion"}
                  width="28"
                  height="28"
                  style={{ borderRadius: "4px", flexShrink: 0 }}
                />
              )}
              <span>{row.player}</span>
              {isLeft && row.iconUrl && (
                <img
                  src={row.iconUrl}
                  alt={row.championName || "Champion"}
                  width="28"
                  height="28"
                  style={{ borderRadius: "4px", flexShrink: 0 }}
                />
              )}
            </div>

            {/* Bar container */}
            <div className="flex-1 h-8 relative order-2">
              <div
                className="absolute top-0 bottom-0 transition-all"
                style={{
                  backgroundColor: color,
                  opacity: 0.3,
                  borderRadius: "4px",
                  [isLeft ? "left" : "right"]: 0,
                  width: `${percentage}%`,
                }}
              />
              <div
                className="absolute top-0 bottom-0 flex items-center"
                style={{
                  backgroundColor: color,
                  borderRadius: "4px",
                  [isLeft ? "left" : "right"]: 0,
                  width: `${percentage}%`,
                  padding: "0 8px",
                  [isLeft ? "justifyContent" : "justifyContent"]: isLeft
                    ? "flex-end"
                    : "flex-start",
                }}
              >
                <span
                  style={{
                    color: "var(--dashboard-text-primary)",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  {row.value.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Value - right aligned for left team, left aligned for right team */}
            <div
              className={isLeft ? "order-3" : "text-left order-1"}
              style={{
                color: "var(--dashboard-text-primary)",
                fontSize: "14px",
                fontWeight: 500,
                minWidth: "100px",
              }}
            >
              {/* Spacer for alignment */}
            </div>
          </div>
        );
      })}
    </div>
  );
}
