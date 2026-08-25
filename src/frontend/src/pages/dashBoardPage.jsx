import BanRow from "@/components/ban-row";
import DashboardCard from "@/components/dashboard-card";
import Divider from "@/components/divider";
import GoldDifferenceChart from "@/components/gold-difference-chart";
import HorizontalBarChart from "@/components/horizontal-bar-chart";
import ObjectiveIcons from "@/components/objective-icons";
import ObjectiveRow from "@/components/objective-row";
import SectionTitle from "@/components/section-title";
import StatRow from "@/components/stat-row";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const formatGold = (value) => `${(value / 1000).toFixed(1)}K`;

const getTeam = (teams, side) =>
  teams.find((team) => team.side === side) || {
    kda: { kills: 0, deaths: 0, assists: 0 },
    gold: 0,
    towers: 0,
    objectives: {},
    bans: [],
  };

const DashboardPage = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");
  const searchParams = new URLSearchParams(window.location.search);
  const matchId = searchParams.get("matchId");
  const riotApiKey = searchParams.get("riotApiKey");
  useEffect(() => {
    if (!matchId || !riotApiKey) {
      setError("Add matchId and riotApiKey to the URL to load a match.");
      return;
    }

    const loadDashboard = async () => {
      try {
        const response = await fetch(
          `${API_URL}/match_dashboard/${encodeURIComponent(matchId)}/${encodeURIComponent(riotApiKey)}`,
        );
        if (!response.ok) {
          throw new Error(`Backend returned ${response.status}`);
        }
        setDashboard(await response.json());
      } catch (requestError) {
        setError(`Could not load match data: ${requestError.message}`);
      }
    };

    loadDashboard();
  }, [matchId, riotApiKey]);

  if (error) {
    return <div className="p-8 text-red-400">{error}</div>;
  }

  if (!dashboard) {
    return <div className="p-8">Loading match data...</div>;
  }

  const leftTeam = getTeam(dashboard.teams, "left");
  const rightTeam = getTeam(dashboard.teams, "right");

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--dashboard-bg)",
        fontFamily: "Inter, sans-serif",
        padding: "32px",
      }}
    >
      <div style={{ maxWidth: "1600px", margin: "0 auto 24px" }}>
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={17} /> BACK TO MATCHES
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: "24px",
          maxWidth: "1600px",
          margin: "0 auto",
        }}
      >
        {/* Left Panel - Game Stats */}
        <div style={{ gridColumn: "1 / 6" }}>
          <DashboardCard>
            <SectionTitle>GAME STATS</SectionTitle>

            <StatRow
              items={[
                {
                  label: "KDA",
                  leftValue: `${leftTeam.kda.kills} / ${leftTeam.kda.deaths} / ${leftTeam.kda.assists}`,
                  rightValue: `${rightTeam.kda.kills} / ${rightTeam.kda.deaths} / ${rightTeam.kda.assists}`,
                },
                {
                  label: "GOLD",
                  leftValue: formatGold(leftTeam.gold),
                  rightValue: formatGold(rightTeam.gold),
                },
              ]}
            />

            <Divider />

            <ObjectiveRow
              label="TOWERS"
              leftValue={leftTeam.towers}
              rightValue={rightTeam.towers}
            />

            <ObjectiveIcons
              label="VOID GRUBS"
              leftCount={leftTeam.objectives.horde}
              rightCount={rightTeam.objectives.horde}
            />

            <ObjectiveIcons
              label="DRAGONS"
              leftCount={leftTeam.objectives.dragon}
              rightCount={rightTeam.objectives.dragon}
            />

            <ObjectiveRow
              label="BARONS"
              leftValue={leftTeam.objectives.baron}
              rightValue={rightTeam.objectives.baron}
            />

            <Divider />

            <BanRow
              label="BANS"
              leftTeamIcons={leftTeam.bans}
              rightTeamIcons={rightTeam.bans}
            />
          </DashboardCard>
        </div>

        {/* Right Panel - Damage and Gold Charts */}
        <div
          style={{
            gridColumn: "6 / 13",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {/* Total Damage Dealt */}
          <DashboardCard>
            <SectionTitle>TOTAL DAMAGE DEALT</SectionTitle>
            <HorizontalBarChart rows={dashboard.damage} />
          </DashboardCard>

          {/* Gold Difference */}
          <DashboardCard>
            <SectionTitle>GOLD DIFFERENCE</SectionTitle>
            <GoldDifferenceChart data={dashboard.goldDifference} />
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
