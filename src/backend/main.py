import uvicorn
import requests
from functools import lru_cache
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services.match_transformer import transform_match
app = FastAPI()
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_puuids_by_game_name_game_tags(game_name: str, game_tags: str, riot_api_key: str):
    url = f'https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{game_name}/{game_tags}?api_key={riot_api_key}'

    request = requests.get(url=url)
    data = request.json()

    return data
def get_match_ids_by_puuid(puuid: str, riot_api_key: str):
    matchs_url = f'https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?type=ranked&start=0&count=5&api_key={riot_api_key}'

    match_ids = requests.get(url=matchs_url).json()
    return match_ids

def get_match_details_by_match_id(match_id: str, riot_api_key: str):
    match_url  = f'https://asia.api.riotgames.com/lol/match/v5/matches/{match_id}?api_key={riot_api_key}'
    raw_match_data = requests.get(url=match_url).json()

    return raw_match_data


def get_match_timeline_by_match_id(match_id: str, riot_api_key: str):
    timeline_url = f'https://asia.api.riotgames.com/lol/match/v5/matches/{match_id}/timeline?api_key={riot_api_key}'
    return requests.get(url=timeline_url).json()


@lru_cache(maxsize=1)
def get_champion_catalog():
    versions = requests.get(
        "https://ddragon.leagueoflegends.com/api/versions.json", timeout=10
    ).json()
    version = versions[0]
    champion_data = requests.get(
        f"https://ddragon.leagueoflegends.com/cdn/{version}/data/en_US/champion.json",
        timeout=10,
    ).json().get("data", {})
    return {
        int(champion["key"]): {
            "name": champion["name"],
            "iconUrl": f"https://ddragon.leagueoflegends.com/cdn/{version}/img/champion/{champion['image']['full']}",
        }
        for champion in champion_data.values()
    }


@lru_cache(maxsize=1)
def get_item_catalog():
    versions = requests.get(
        "https://ddragon.leagueoflegends.com/api/versions.json", timeout=10
    ).json()
    version = versions[0]
    item_data = requests.get(
        f"https://ddragon.leagueoflegends.com/cdn/{version}/data/en_US/item.json",
        timeout=10,
    ).json().get("data", {})
    return {
        int(item_id): f"https://ddragon.leagueoflegends.com/cdn/{version}/img/item/{item_id}.png"
        for item_id in item_data
    }


@app.get("/match_ids/{game_name}/{game_tags}/{riot_api_key}")
def get_match_ids(game_name: str, game_tags: str, riot_api_key: str):
    data = get_puuids_by_game_name_game_tags(game_name, game_tags, riot_api_key)
    puuid = data.get("puuid")
    match_ids = get_match_ids_by_puuid(puuid, riot_api_key)
    return match_ids


@app.get("/matches/{game_name}/{game_tags}/{riot_api_key}")
def get_matches(game_name: str, game_tags: str, riot_api_key: str):
    account = get_puuids_by_game_name_game_tags(game_name, game_tags, riot_api_key)
    if "puuid" not in account:
        raise HTTPException(status_code=404, detail="Riot account could not be found")

    match_ids = get_match_ids_by_puuid(account["puuid"], riot_api_key)
    try:
        item_catalog = get_item_catalog()
    except (requests.RequestException, KeyError, TypeError, ValueError):
        item_catalog = {}
    matches = []
    for match_id in match_ids:
        match = get_match_details_by_match_id(match_id, riot_api_key)
        if "info" not in match:
            continue

        participants = match["info"].get("participants", [])
        player = next(
            (participant for participant in participants if participant.get("puuid") == account["puuid"]),
            {},
        )
        matches.append({
            "matchId": match_id,
            "gameCreation": match["info"].get("gameCreation"),
            "gameDuration": match["info"].get("gameDuration"),
            "gameMode": match["info"].get("gameMode"),
            "win": player.get("win", False),
            "championId": player.get("championId"),
            "championName": player.get("championName"),
            "kda": {
                "kills": player.get("kills", 0),
                "deaths": player.get("deaths", 0),
                "assists": player.get("assists", 0),
            },
            "items": [
                {
                    "id": player.get(f"item{index}"),
                    "iconUrl": item_catalog.get(player.get(f"item{index}")),
                }
                for index in range(7)
                if player.get(f"item{index}")
            ],
            "level": player.get("champLevel", 0),
        })

    return {
        "gameName": account.get("gameName", game_name),
        "tagLine": account.get("tagLine", game_tags),
        "matches": matches,
    }


@app.get("/match_details/{match_id}/{riot_api_key}")
def get_match_details(match_id: str, riot_api_key: str):
    match_details = get_match_details_by_match_id(match_id, riot_api_key)
    return match_details


@app.get("/match_dashboard/{match_id}/{riot_api_key}")
def get_match_dashboard(match_id: str, riot_api_key: str):
    match_details = get_match_details_by_match_id(match_id, riot_api_key)
    if "info" not in match_details:
        raise HTTPException(status_code=502, detail="Riot match details could not be loaded")

    timeline = get_match_timeline_by_match_id(match_id, riot_api_key)
    if "info" not in timeline:
        raise HTTPException(status_code=502, detail="Riot match timeline could not be loaded")

    try:
        champion_catalog = get_champion_catalog()
    except (requests.RequestException, KeyError, TypeError, ValueError):
        champion_catalog = {}

    return transform_match(match_details, timeline, champion_catalog)
@app.get("/")
def root():
    return {"message": "Hello World"}

# ?game_name={game_name}&game_tags={game_tags}&riot_api_key={riot_api_key}
if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)


