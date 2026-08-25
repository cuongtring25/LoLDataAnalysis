# LoL Match Scope

LoL Match Scope is a personal League of Legends match analysis dashboard. It uses a Riot ID and Riot API key to retrieve recent ranked matches, then presents match summaries and detailed visual analysis in a React web interface.

## Features

- Search for a player by Riot ID and tag line.
- Retrieve the player's five most recent ranked matches in the Asia region.
- Browse match results, KDA, champion, items, level, duration, and outcome.
- Open a detailed dashboard for an individual match.
- Compare team KDA, gold, towers, Void Grubs, dragons, Barons, and bans.
- Inspect total damage dealt and gold difference charts.
- Navigate back from a match dashboard to the previous match list.

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Recharts
- Tailwind CSS
- Lucide React

### Backend

- Python
- FastAPI
- Uvicorn
- Requests
- Pandas and NumPy
- Riot Games API and Data Dragon

## Project Structure

```text
.
├── notebook/                 # Data exploration notebooks
├── src/
│   ├── backend/
│   │   ├── main.py           # FastAPI application and API routes
│   │   ├── requirements.txt
│   │   └── services/
│   │       └── match_transformer.py
│   └── frontend/
│       ├── src/
│       │   ├── components/   # Dashboard and chart components
│       │   └── pages/        # Import, matches, and dashboard pages
│       ├── package.json
│       └── vite.config.js
└── README.md
```

## Requirements

- Python 3.10 or newer
- Node.js 18 or newer
- A Riot Games API key

You can request a development key from the [Riot Developer Portal](https://developer.riotgames.com/). Development keys expire periodically.

## Setup

### 1. Install backend dependencies

From the repository root:

```bash
cd src/backend
python -m venv .venv
```

Activate the virtual environment:

**Windows PowerShell**

```powershell
.venv\Scripts\Activate.ps1
```

**macOS/Linux**

```bash
source .venv/bin/activate
```

Install the dependencies:

```bash
python -m pip install -r requirements.txt
```

### 2. Install frontend dependencies

In a second terminal, from the repository root:

```bash
cd src/frontend
npm install
```

## Running the Application

Start the backend from `src/backend`:

```bash
uvicorn main:app --reload --host localhost --port 8000
```

Start the frontend from `src/frontend`:

```bash
npm run dev
```

Open the URL shown by Vite, usually:

```text
http://localhost:5173
```

The frontend uses `http://localhost:8000` as the default backend URL. To use another backend URL, create `src/frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

Restart the Vite development server after changing environment variables.

## Usage

1. Enter a player's Riot ID, tag line, and Riot API key on the start page.
2. Select **Load Matches** to retrieve recent ranked games.
3. Select a match to open its detailed dashboard.
4. Select **Back to Matches** to return to the match list.

The Riot API key is sent through the local backend for each lookup. Do not commit API keys, place them in source files, or share URLs containing a key.

## API Endpoints

The backend provides the following routes:

| Method | Endpoint                                            | Purpose                           |
| ------ | --------------------------------------------------- | --------------------------------- |
| `GET`  | `/`                                                 | Health check message              |
| `GET`  | `/matches/{game_name}/{game_tags}/{riot_api_key}`   | Get recent ranked match summaries |
| `GET`  | `/match_ids/{game_name}/{game_tags}/{riot_api_key}` | Get recent match IDs              |
| `GET`  | `/match_details/{match_id}/{riot_api_key}`          | Get raw match details             |
| `GET`  | `/match_dashboard/{match_id}/{riot_api_key}`        | Get transformed dashboard data    |

Interactive API documentation is available at `http://localhost:8000/docs` while the backend is running.

## Frontend Commands

Run these commands from `src/frontend`:

```bash
npm run dev       # Start the development server
npm run build     # Create a production build
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```

## Notes

- Riot API requests currently use the Asia routing endpoint.
- The matches view requests up to five ranked matches.
- Champion and item icons are loaded from Riot Data Dragon.
- CORS is configured for local frontend development on ports `3000` and `5173`.
