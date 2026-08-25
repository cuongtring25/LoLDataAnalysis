export default function ObjectiveRow({ label, leftValue, rightValue }) {
  return (
    <div className="mb-4">
      <div
        className="mb-2"
        style={{
          color: "var(--dashboard-text-secondary)",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </div>
      <div className="flex items-center justify-between">
        <div
          style={{
            color: "var(--dashboard-blue)",
            fontSize: "20px",
            fontWeight: 700,
          }}
        >
          {leftValue}
        </div>
        <div
          style={{
            color: "var(--dashboard-yellow)",
            fontSize: "20px",
            fontWeight: 700,
          }}
        >
          {rightValue}
        </div>
      </div>
    </div>
  );
}
