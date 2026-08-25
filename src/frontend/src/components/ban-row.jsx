import { Shield, X } from "lucide-react";

export default function BanRow({ label, leftTeamIcons, rightTeamIcons }) {
  const renderBans = (bans, color, isLeftTeam) => {
    const slots = Array(5).fill(null);
    let nextAvailableSlot = 0;

    bans.forEach((ban) => {
      const pickTurn = Number(ban.pickTurn);
      const slot =
        pickTurn >= 1 && pickTurn <= 10
          ? Math.floor((pickTurn - (isLeftTeam ? 1 : 2)) / 2)
          : nextAvailableSlot;
      if (slots[slot] === null) {
        slots[slot] = ban;
      }
      nextAvailableSlot = slots.findIndex((currentBan) => currentBan === null);
      if (nextAvailableSlot === -1) nextAvailableSlot = 5;
    });

    return slots.map((ban, index) => (
      <div
        key={ban?.championId || `empty-${index}`}
        className="flex items-center justify-center"
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "6px",
          backgroundColor: "var(--dashboard-divider)",
          overflow: "hidden",
        }}
      >
        {ban?.iconUrl ? (
          <img
            src={ban.iconUrl}
            alt={ban.championName || "Banned champion"}
            width="32"
            height="32"
          />
        ) : ban ? (
          <Shield size={16} style={{ color }} />
        ) : (
          <X size={18} style={{ color }} strokeWidth={3} />
        )}
      </div>
    ));
  };

  return (
    <div>
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
        <div className="flex gap-2">
          {renderBans(leftTeamIcons, "var(--dashboard-blue)", true)}
        </div>
        <div className="flex gap-2">
          {renderBans(rightTeamIcons, "var(--dashboard-yellow)", false)}
        </div>
      </div>
    </div>
  );
}
