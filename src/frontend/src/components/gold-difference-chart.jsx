import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export default function GoldDifferenceChart({ data = [] }) {
  const chartData = data.reduce((points, point, index) => {
    const currentValue = Number(point.goldDiff) || 0;
    const previousPoint = data[index - 1];
    const previousValue = previousPoint
      ? Number(previousPoint.goldDiff) || 0
      : 0;

    if (
      previousPoint &&
      previousValue !== 0 &&
      currentValue !== 0 &&
      Math.sign(previousValue) !== Math.sign(currentValue)
    ) {
      const ratio =
        Math.abs(previousValue) /
        (Math.abs(previousValue) + Math.abs(currentValue));
      points.push({
        minute:
          Number(previousPoint.minute) +
          (Number(point.minute) - Number(previousPoint.minute)) * ratio,
        goldDiff: 0,
        positiveGoldDiff: 0,
        negativeGoldDiff: 0,
      });
    }

    points.push({
      ...point,
      positiveGoldDiff: currentValue >= 0 ? currentValue : null,
      negativeGoldDiff: currentValue <= 0 ? currentValue : null,
    });
    return points;
  }, []);

  const maxGoldDiff = Math.max(
    ...data.map((point) => Math.abs(point.goldDiff)),
    1000,
  );
  const chartLimit = Math.ceil(maxGoldDiff / 1000) * 1000;

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs></defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--dashboard-divider)"
            opacity={0.3}
          />
          <XAxis
            dataKey="minute"
            stroke="var(--dashboard-text-secondary)"
            style={{ fontSize: "12px" }}
            label={{
              value: "Minutes",
              position: "insideBottom",
              offset: -5,
              style: {
                fill: "var(--dashboard-text-secondary)",
                fontSize: "12px",
              },
            }}
          />
          <YAxis
            domain={[-chartLimit, chartLimit]}
            stroke="var(--dashboard-text-secondary)"
            style={{ fontSize: "12px" }}
            tickFormatter={(value) =>
              `${value > 0 ? "+" : ""}${(value / 1000).toFixed(1)}k`
            }
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--dashboard-panel)",
              border: "1px solid var(--dashboard-divider)",
              borderRadius: "8px",
              color: "var(--dashboard-text-primary)",
            }}
            labelStyle={{ color: "var(--dashboard-text-secondary)" }}
            formatter={(value) => [
              `${value > 0 ? "+" : ""}${Number(value).toLocaleString()}`,
              "Gold Diff",
            ]}
            labelFormatter={(label) => `${label} min`}
          />
          <ReferenceLine
            y={0}
            stroke="var(--dashboard-text-secondary)"
            strokeDasharray="3 3"
            opacity={0.5}
          />
          <Area
            type="monotone"
            dataKey="positiveGoldDiff"
            stroke="var(--dashboard-blue)"
            strokeWidth={2}
            fill="none"
          />
          <Area
            type="monotone"
            dataKey="negativeGoldDiff"
            stroke="var(--dashboard-yellow)"
            strokeWidth={2}
            fill="none"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
