import W_Season from "@/schemas/season/w_season";
import { DEFAULT_LEAGUE } from "./constants";

export async function LEAGUE_SCHEMA_SWITCH(leagueName) {
  switch (leagueName) {
    case "w":
      return W_Season;
    default:
      return W_Season;
  }
}

// returns an object
export async function READ_SEASON_FIELD_DATA(
  leagueName,
  seasonNumber,
  requestedField
) {
  const League = await getLeagueAndSeason(leagueName, seasonNumber);

  const fieldData = {};
  await League.getFieldData(seasonNumber, requestedField, fieldData);

  return fieldData;
}

export async function READ_SEASON_STANDINGS(leagueName, seasonNumber) {
  const League = await getLeagueAndSeason(leagueName, seasonNumber);

  const standings = await League.getSortedStandings(seasonNumber);

  return standings;
}

export async function CLEAR_LEAGUE_TABLE_SWITCH(leagueName) {
  switch (leagueName) {
    case "w":
      return W_Season;
    default:
      return DEFAULT_LEAGUE;
  }
}

////////////////////////////////////////////
// helper methods for above constant methods
////////////////////////////////////////////

async function getLeagueAndSeason(leagueName, seasonNumber) {
  const leagueSchema = await LEAGUE_SCHEMA_SWITCH(leagueName);

  const doesSeasonExist = await leagueSchema.queryForIfSeasonExists(
    seasonNumber
  );
  if (!doesSeasonExist) {
    throw new Error(`Season ${seasonNumber} does not exist`);
  }

  return leagueSchema;
}
