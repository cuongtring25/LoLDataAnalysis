export default function SectionTitle({ children }) {
  return (
    <h2
      className="mb-6"
      style={{
        color: "var(--dashboard-text-secondary)",
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.1em",
      }}
    >
      {children}
    </h2>
  );
}
