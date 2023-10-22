import W_Season from "@/schemas/season/w_season";

export const LEAGUE_SCHEMA_SWITCH = async (leagueName) => {
  switch (leagueName) {
    case "w":
      return W_Season;
    default:
      return W_Season;
  }
};

// returns an object
export const READ_SEASON_FIELD_DATA = async (
  leagueName,
  seasonNumber,
  requestedField
) => {
  const League = await getLeagueAndSeason(leagueName, seasonNumber);

  const fieldData = {};
  await League.getFieldData(seasonNumber, requestedField, fieldData);

  return fieldData;
};

export const READ_SEASON_STANDINGS = async (leagueName, seasonNumber) => {
  const League = await getLeagueAndSeason(leagueName, seasonNumber);

  const standings = await League.getSortedStandings(seasonNumber);

  return standings;
};

export const CLEAR_LEAGUE_TABLE_SWITCH = (leagueName) => {
  switch (leagueName) {
    case "w":
      return W_Season;
    default:
      return;
  }
};

////////////////////////////////////////////
// helper methods for above constant methods
////////////////////////////////////////////

const getLeagueAndSeason = async (leagueName, seasonNumber) => {
  const leagueSchema = await LEAGUE_SCHEMA_SWITCH(leagueName);

  const doesSeasonExist = await leagueSchema.queryForIfSeasonExists(
    seasonNumber
  );
  if (!doesSeasonExist) {
    throw new Error(`Season ${seasonNumber} does not exist`);
  }

  return leagueSchema;
};
