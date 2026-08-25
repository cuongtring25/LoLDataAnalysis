export default function StatRow({ items }) {
  return (
    <div className="space-y-4 mb-6">
      {items.map((item, index) => (
        <div key={index}>
          <div
            className="mb-2"
            style={{
              color: "var(--dashboard-text-secondary)",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.05em",
            }}
          >
            {item.label}
          </div>
          <div className="flex items-center justify-between">
            <div
              style={{
                color: "var(--dashboard-blue)",
                fontSize: "20px",
                fontWeight: 700,
              }}
            >
              {item.leftValue}
            </div>
            <div
              style={{
                color: "var(--dashboard-yellow)",
                fontSize: "20px",
                fontWeight: 700,
              }}
            >
              {item.rightValue}
            </div>
          </div>
          {item.note && (
            <div
              className="mt-1"
              style={{
                color: "var(--dashboard-text-secondary)",
                fontSize: "12px",
              }}
            >
              {item.note}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
