import { ReactNode } from "react";

export default function DashboardCard({ children, className = "" }) {
  return (
    <div
      className={`bg-[--dashboard-panel] rounded-xl p-6 ${className}`}
      style={{ borderRadius: "12px" }}
    >
      {children}
    </div>
  );
}
