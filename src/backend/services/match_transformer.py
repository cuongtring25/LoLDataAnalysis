from collections import defaultdict
from typing import Any


TEAM_SIDES = {100: "left", 200: "right"}


def _number(value: Any) -> int:
    return int(value or 0)


def _player_name(participant: dict[str, Any]) -> str:
    return participant.get("riotIdGameName") or participant.get("summonerName") or "Unknown"


def _team_summary(
    team: dict[str, Any],
    participants: list[dict[str, Any]],
    champion_catalog: dict[int, dict[str, str]],
) -> dict[str, Any]:
    team_id = team["teamId"]
    team_players = [player for player in participants if player.get("teamId") == team_id]
    objectives = team.get("objectives", {})

    return {
        "teamId": team_id,
        "side": TEAM_SIDES.get(team_id, "right"),
        "win": team.get("win", False),
        "kda": {
            "kills": sum(_number(player.get("kills")) for player in team_players),
            "deaths": sum(_number(player.get("deaths")) for player in team_players),
            "assists": sum(_number(player.get("assists")) for player in team_players),
        },
        "gold": sum(_number(player.get("goldEarned")) for player in team_players),
        "towers": _number(objectives.get("tower", {}).get("kills")),
        "objectives": {
            objective_name: _number(objectives.get(objective_name, {}).get("kills"))
            for objective_name in ("dragon", "baron", "riftHerald", "horde", "atakhan", "inhibitor")
        },
        "picks": [
            {
                "participantId": player.get("participantId"),
                "championId": player.get("championId"),
                "championName": player.get("championName"),
                "iconUrl": champion_catalog.get(player.get("championId"), {}).get("iconUrl"),
            }
            for player in team_players
        ],
        "bans": [
            {
                "championId": ban.get("championId"),
                "championName": champion_catalog.get(ban.get("championId"), {}).get("name"),
                "iconUrl": champion_catalog.get(ban.get("championId"), {}).get("iconUrl"),
                "pickTurn": ban.get("pickTurn"),
            }
            for ban in team.get("bans", [])
            if ban.get("championId", -1) != -1
        ],
    }


def _gold_difference(timeline: dict[str, Any], team_ids: list[int]) -> list[dict[str, int]]:
    points = []
    for frame in timeline.get("info", {}).get("frames", []):
        team_gold = defaultdict(int)
        for participant in frame.get("participantFrames", {}).values():
            team_id = participant.get("participantId")
            if team_id is None:
                continue
            # participantId is 1-5 for team 100 and 6-10 for team 200.
            resolved_team_id = team_ids[0] if int(team_id) <= 5 else team_ids[1]
            team_gold[resolved_team_id] += _number(participant.get("totalGold"))

        left_gold = team_gold[team_ids[0]]
        right_gold = team_gold[team_ids[1]]
        points.append({
            "minute": _number(frame.get("timestamp")) // 60000,
            "leftGold": left_gold,
            "rightGold": right_gold,
            "goldDiff": left_gold - right_gold,
        })
    return points


def transform_match(
    match: dict[str, Any],
    timeline: dict[str, Any] | None = None,
    champion_catalog: dict[int, dict[str, str]] | None = None,
) -> dict[str, Any]:
    info = match.get("info", {})
    participants = info.get("participants", [])
    teams = info.get("teams", [])
    team_ids = [team.get("teamId") for team in teams]

    champion_catalog = champion_catalog or {}

    return {
        "matchId": match.get("metadata", {}).get("matchId"),
        "gameVersion": info.get("gameVersion"),
        "durationSeconds": _number(info.get("gameDuration")),
        "teams": [_team_summary(team, participants, champion_catalog) for team in teams],
        "damage": [
            {
                "player": _player_name(player),
                "puuid": player.get("puuid"),
                "championId": player.get("championId"),
                "championName": player.get("championName"),
                "iconUrl": champion_catalog.get(player.get("championId"), {}).get("iconUrl"),
                "value": _number(player.get("totalDamageDealtToChampions")),
                "valueBefore14Minutes": _number(player.get("damageDealtToChampionsBefore14Minutes")),
                "team": TEAM_SIDES.get(player.get("teamId"), "right"),
            }
            for player in participants
        ],
        "goldDifference": _gold_difference(timeline or {}, team_ids) if len(team_ids) == 2 else [],
    }