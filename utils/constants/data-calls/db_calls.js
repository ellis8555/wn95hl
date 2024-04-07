import { DEFAULT_LEAGUE, HOW_MANY_GAME_RESULTS } from "../constants";

export async function LEAGUE_SCHEMA_SWITCH(leagueName) {
  let LeagueSchema;
  switch (leagueName) {
    case "w":
      LeagueSchema = (await import("@/schemas/season/w_season")).default;
      break;
    case "W":
      LeagueSchema = (await import("@/schemas/season/w_season")).default;
      break;
    case "q":
      LeagueSchema = (await import("@/schemas/season/q_season")).default;
      break;
    case "Q":
      LeagueSchema = (await import("@/schemas/season/q_season")).default;
      break;
    case "v":
      LeagueSchema = (await import("@/schemas/season/v_season")).default;
      break;
    case "V":
      LeagueSchema = (await import("@/schemas/season/v_season")).default;
      break;
    case "p":
      LeagueSchema = (await import("@/schemas/season/p_season")).default;
      break;
    case "P":
      LeagueSchema = (await import("@/schemas/season/p_season")).default;
      break;
    default:
      LeagueSchema = (await import("@/schemas/season/w_season")).default;
  }
  return LeagueSchema;
}

export async function LEAGUE_GAMES_SCHEMA_SWITCH(leagueName) {
  let GameSchema;
  switch (leagueName) {
    case "w":
      GameSchema = (await import("@/schemas/games/w_games")).default;
      break;
    case "W":
      GameSchema = (await import("@/schemas/games/w_games")).default;
      break;
    case "q":
      GameSchema = (await import("@/schemas/games/q_games")).default;
      break;
    case "Q":
      GameSchema = (await import("@/schemas/games/q_games")).default;
      break;
    case "v":
      GameSchema = (await import("@/schemas/games/v_games")).default;
      break;
    case "V":
      GameSchema = (await import("@/schemas/games/v_games")).default;
      break;
    case "p":
      GameSchema = (await import("@/schemas/games/p_games")).default;
      break;
    case "P":
      GameSchema = (await import("@/schemas/games/p_games")).default;
      break;
    default:
      GameSchema = (await import("@/schemas/games/w_games")).default;
  }
  return GameSchema;
}

export async function READ_SEASON_STANDINGS(leagueName, seasonNumber) {
  const League = await getLeagueSchema(leagueName, seasonNumber);

  const standings = await League.getSortedStandings(seasonNumber);

  return standings;
}

export async function READ_SEASON_CONFERENCES(leagueName, seasonNumber) {
  const League = await getLeagueSchema(leagueName, seasonNumber);
  const conferences = await League.getConferences(seasonNumber);
  return conferences;
}

export async function CLEAR_LEAGUE_TABLE_SWITCH(leagueName) {
  let LeagueSchema;
  switch (leagueName) {
    case "w":
      LeagueSchema = (await import("@/schemas/season/w_season")).default;
      break;
    case "W":
      LeagueSchema = (await import("@/schemas/season/w_season")).default;
      break;
    case "q":
      LeagueSchema = (await import("@/schemas/season/q_season")).default;
      break;
    case "Q":
      LeagueSchema = (await import("@/schemas/season/q_season")).default;
      break;
    case "v":
      LeagueSchema = (await import("@/schemas/season/v_season")).default;
      break;
    case "V":
      LeagueSchema = (await import("@/schemas/season/v_season")).default;
      break;
    case "p":
      LeagueSchema = (await import("@/schemas/season/p_season")).default;
      break;
    case "P":
      LeagueSchema = (await import("@/schemas/season/p_season")).default;
      break;
    default:
      LeagueSchema = DEFAULT_LEAGUE;
  }
  return LeagueSchema;
}

////////////////
// api method
////////////////
// returns an object
export async function READ_SEASON_FIELD_DATA(
  leagueName,
  seasonNumber,
  requestedField
) {
  const League = await getLeagueSchema(leagueName, seasonNumber);
  const fieldData = {};
  await League.getFieldData(seasonNumber, requestedField, fieldData);
  return fieldData;
}

// returns an object
export async function READ_SEASON_GAMES_FIELD_DATA(
  leagueName,
  seasonNumber,
  requestedField
) {
  const Games = await getGamesSchema(leagueName, seasonNumber);
  const fieldData = {};
  await Games.getFieldData(seasonNumber, requestedField, fieldData);
  return fieldData;
}

//////////////////////////////////////
// api method takes in 4th param index
//////////////////////////////////////
// returns an object
export async function READ_SEASON_GAME_RESULTS(
  leagueName,
  seasonNumber,
  indexNumber
) {
  const Games = await getGamesSchema(leagueName, seasonNumber);
  const { selectedGames, totalGamesSubmitted } = await Games.getSelectedGames(
    seasonNumber,
    indexNumber,
    HOW_MANY_GAME_RESULTS
  );

  const gameData = { selectedGames, totalGamesSubmitted };
  return gameData;
}

////////////////////////////////////////////
// helper methods for above constant methods
////////////////////////////////////////////

// returns league schema if season number exists
async function getLeagueSchema(leagueName, seasonNumber) {
  const leagueSchema = await LEAGUE_SCHEMA_SWITCH(leagueName);

  const doesSeasonExist = await leagueSchema.queryForIfSeasonExists(
    seasonNumber
  );
  if (!doesSeasonExist) {
    throw new Error(`Season ${seasonNumber} does not exist`);
  }

  return leagueSchema;
}

// returns games schema if season exists
async function getGamesSchema(leagueName, seasonNumber) {
  const leagueSchema = await LEAGUE_SCHEMA_SWITCH(leagueName);

  const doesSeasonExist = await leagueSchema.queryForIfSeasonExists(
    seasonNumber
  );
  if (!doesSeasonExist) {
    throw new Error(`Season ${seasonNumber} does not exist`);
  }

  const gamesSchema = await LEAGUE_GAMES_SCHEMA_SWITCH(leagueName);

  return gamesSchema;
}
