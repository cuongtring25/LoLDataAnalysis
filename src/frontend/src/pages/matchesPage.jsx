import {
  ArrowLeft,
  ArrowUpRight,
  Clock3,
  Gamepad2,
  LoaderCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const formatDuration = (seconds) =>
  `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
const formatDate = (timestamp) =>
  timestamp
    ? new Date(timestamp).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : "Recent";

const MatchesPage = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const gameName = params.get("gameName");
  const tagLine = params.get("tagLine");
  const riotApiKey = params.get("riotApiKey");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!gameName || !tagLine || !riotApiKey) {
      navigate("/", { replace: true });
      return;
    }
    const loadMatches = async () => {
      try {
        const response = await fetch(
          `${API_URL}/matches/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}/${encodeURIComponent(riotApiKey)}`,
        );
        if (!response.ok)
          throw new Error(
            (await response.json()).detail ||
              `Backend returned ${response.status}`,
          );
        setData(await response.json());
      } catch (requestError) {
        setError(`Could not load matches: ${requestError.message}`);
      }
    };
    loadMatches();
  }, [gameName, tagLine, riotApiKey, navigate]);

  const openMatch = (matchId) =>
    navigate(
      `/dashboard?matchId=${encodeURIComponent(matchId)}&riotApiKey=${encodeURIComponent(riotApiKey)}`,
    );

  if (error)
    return (
      <main className="page-shell status-page">
        <p>{error}</p>
        <button className="secondary-action" onClick={() => navigate("/")}>
          <ArrowLeft size={16} /> TRY ANOTHER PLAYER
        </button>
      </main>
    );
  if (!data)
    return (
      <main className="page-shell status-page">
        <LoaderCircle className="spin" size={28} />
        <p>Loading recent matches...</p>
      </main>
    );

  return (
    <main className="page-shell matches-page">
      <header className="matches-header">
        <button className="back-button" onClick={() => navigate("/")}>
          <ArrowLeft size={17} /> NEW SEARCH
        </button>
        <div>
          <div className="eyebrow">RECENT PERFORMANCE</div>
          <h1>
            {data.gameName}
            <span>#{data.tagLine}</span>
          </h1>
        </div>
        <div className="match-count">
          <strong>{String(data.matches.length).padStart(2, "0")}</strong>
          <small>MATCHES FOUND</small>
        </div>
      </header>
      <section className="match-list">
        {data.matches.map((match, index) => (
          <button
            className={`match-row ${match.win ? "match-win" : "match-loss"}`}
            key={match.matchId}
            onClick={() => openMatch(match.matchId)}
          >
            <span className="match-index">0{index + 1}</span>
            <span className="result-block">
              <strong>{match.win ? "VICTORY" : "DEFEAT"}</strong>
              <small>
                {formatDate(match.gameCreation)} · {match.gameMode || "CLASSIC"}
              </small>
            </span>
            <span className="champion-block">
              <span className="champion-mark">
                {match.championName?.slice(0, 2).toUpperCase() || "??"}
              </span>
              <strong>{match.championName || "Unknown champion"}</strong>
              <small>LVL {match.level}</small>
            </span>
            <span className="kda-block">
              <strong>
                {match.kda.kills} / <i>{match.kda.deaths}</i> /{" "}
                {match.kda.assists}
              </strong>
              <small>KDA</small>
            </span>
            <span className="item-block">
              {match.items.slice(0, 6).map((item) => (
                <span className="item-chip" key={item.id}>
                  {item.iconUrl ? <img src={item.iconUrl} alt="" /> : item.id}
                </span>
              ))}
            </span>
            <span className="match-time">
              <Clock3 size={15} /> {formatDuration(match.gameDuration || 0)}
            </span>
            <ArrowUpRight className="open-icon" size={18} />
          </button>
        ))}
      </section>
      <footer className="matches-footer">
        <Gamepad2 size={16} /> SELECT A MATCH TO OPEN THE FULL DASHBOARD
      </footer>
    </main>
  );
};

export default MatchesPage;
