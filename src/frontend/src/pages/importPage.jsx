import { ArrowRight, KeyRound, Search, Shield } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

const ImportPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    gameName: "",
    tagLine: "",
    riotApiKey: "",
  });

  const updateField = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams({
      gameName: form.gameName.trim(),
      tagLine: form.tagLine.trim(),
      riotApiKey: form.riotApiKey.trim(),
    });
    navigate(`/matches?${params.toString()}`);
  };

  return (
    <main className="page-shell import-page">
      <section className="import-layout">
        <div className="import-intro">
          <div className="eyebrow">
            <Shield size={15} /> MATCH SCOPE
          </div>
          <h1>
            Read the game
            <br />
            <span>behind the score.</span>
          </h1>
          <p>
            Enter a Riot ID to pull the latest ranked games and inspect every
            decision that shaped the match.
          </p>
          <div className="intro-rule" />
          <div className="intro-meta">
            <span>RECENT MATCHES</span>
            <strong>05</strong>
            <span>REGION</span>
            <strong>ASIA</strong>
          </div>
        </div>

        <form className="import-form" onSubmit={handleSubmit}>
          <div className="form-heading">
            <span className="step-number">01</span>
            <div>
              <h2>Find a player</h2>
              <p>Use the Riot ID shown in game.</p>
            </div>
          </div>
          <label htmlFor="gameName">PLAYER NAME</label>
          <div className="input-wrap">
            <Search size={17} />
            <input
              id="gameName"
              name="gameName"
              value={form.gameName}
              onChange={updateField}
              placeholder="Faker"
              required
            />
          </div>
          <label htmlFor="tagLine">TAG</label>
          <div className="input-wrap">
            <span className="input-prefix">#</span>
            <input
              id="tagLine"
              name="tagLine"
              value={form.tagLine}
              onChange={updateField}
              placeholder="KR1"
              required
            />
          </div>
          <label htmlFor="riotApiKey">RIOT API KEY</label>
          <div className="input-wrap">
            <KeyRound size={17} />
            <input
              id="riotApiKey"
              name="riotApiKey"
              type="password"
              value={form.riotApiKey}
              onChange={updateField}
              placeholder="RGAPI-..."
              required
            />
          </div>
          <button className="primary-action" type="submit">
            LOAD MATCHES <ArrowRight size={18} />
          </button>
          <p className="form-note">
            Your key is sent to Riot through the local backend for this lookup.
          </p>
        </form>
      </section>
    </main>
  );
};

export default ImportPage;
