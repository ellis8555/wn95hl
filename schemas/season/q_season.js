import { Schema, model, models } from "mongoose";
import SeasonSchema from "./season-sub-schemas/season";

const leagueName = "Q";

const Q_LeagueSchema = new Schema({
  ...SeasonSchema.obj,
});

// statics list
// 1. getMostRecentSeasonNumber
// 2. queryForIfSeasonExists
// 3. query for conference names
// 4. query for a teams ranking in the standings
// 5. getSortedStandings
// 6. getFieldData

Q_LeagueSchema.statics.getMostRecentSeasonNumber = async function () {
  const getSeasonNumberFields = await this.find().select("seasonNumber").exec();
  const seasonNumbers = getSeasonNumberFields.map(
    (season) => season.seasonNumber
  );
  const mostRecentSeason = Math.max(...seasonNumbers).toString();
  return mostRecentSeason;
};

Q_LeagueSchema.statics.queryForIfSeasonExists = async function (seasonNumber) {
  const getSeason = await this.findOne({ seasonNumber: seasonNumber });
  if (getSeason === null || getSeason === undefined) {
    return false;
  }
  return true;
};

Q_LeagueSchema.statics.getConferences = async function (seasonNumber) {
  const getSeasonDocument = await this.findOne({ seasonNumber: seasonNumber });
  const conferences = getSeasonDocument["conferences"];

  return conferences;
};

Q_LeagueSchema.statics.getSingleTeamStandings = async function (
  seasonNumber,
  teamAcronym
) {
  const getSeasonDocument = await this.findOne({ seasonNumber: seasonNumber });
  const standings = getSeasonDocument.standings;
  const findTeamInStandings = standings.find(
    (standing) => standing.teamAcronym == teamAcronym
  );
  return findTeamInStandings;
};

Q_LeagueSchema.statics.getSortedStandings = async function (seasonNumber) {
  const getSeasonDocument = await this.findOne({ seasonNumber: seasonNumber });
  const standings = getSeasonDocument["standings"];
  standings.sort((a, b) => {
    // First, sort by 'Pts' property in descending order
    if (b.Pts - a.Pts !== 0) {
      return b.Pts - a.Pts;
    } else if (b.GP - a.GP !== 0) {
      // if teams are tied with games played then sort team with less GP placed ahead
      return a.GP - b.GP;
    } else if (b.GP - a.GP !== 0) {
      // if teams pts and GP tied then sort team with more wins placed ahead
      return b.W - a.W;
    } else {
      // If 'Pts' and 'GP' are equal, check 'GP' values for zero
      if (a.GP === 0 && b.GP === 0) {
        // If both 'GP' values are 0, sort by 'teamName' in ascending order
        return a.teamName.localeCompare(b.teamName);
      } else if (a.GP === 0) {
        // If 'GP' of 'a' is 0, it comes first
        return -1;
      } else if (b.GP === 0) {
        // If 'GP' of 'b' is 0, it comes first
        return 1;
      } else {
        // If 'GP' values are non-zero and equal, sort by 'teamName'
        return a.teamName.localeCompare(b.teamName);
      }
    }
  });
  return standings;
};

Q_LeagueSchema.statics.getFieldData = async function (
  seasonNumber,
  paramtersList,
  requestedDataObject
) {
  const seasonDocument = await this.findOne({ seasonNumber: seasonNumber });
  ////////////////////////////////////////
  // get the leagues standings
  ////////////////////////////////////////
  if (paramtersList.includes("standings")) {
    requestedDataObject.standings = await this.getSortedStandings(seasonNumber);
  }
  ////////////////////////////////////////
  // get the most recent-season
  ////////////////////////////////////////
  if (paramtersList.includes("recent-season")) {
    requestedDataObject.recentSeason = await this.getMostRecentSeasonNumber();
  }
  /////////////////////////////////////////////////////
  // if divisions and conferences are required then add
  /////////////////////////////////////////////////////
  if (paramtersList.includes("teams-conferences-and-divisions")) {
    const leagueStructure = {};
    seasonDocument["teams"].forEach((team) => {
      leagueStructure[team.teamAcronym] = {
        conference: team["conference"],
        division: team["division"],
      };
    });
    requestedDataObject.divisionsAndConferences = leagueStructure;
  }

  ////////////////////////////////////////
  // if teams dictCodes required then add
  ////////////////////////////////////////
  if (paramtersList.includes("team-codes")) {
    if (!seasonDocument.hasSeasonBegun) {
      requestedDataObject.error = true;
      requestedDataObject.message = `Season ${seasonNumber} of the ${leagueName.toUpperCase()} has not officially began.`;
      return requestedDataObject;
    }
    if (seasonDocument.hasSeasonEnded) {
      requestedDataObject.error = true;
      requestedDataObject.message = `Season ${seasonNumber} of the ${leagueName.toUpperCase()} has officially ended.`;
      return requestedDataObject;
    }
    requestedDataObject.dictCodes = seasonDocument["teamsDictCodes"];
  }

  return requestedDataObject;
};

/////////////////////////
// end of static methods
/////////////////////////

const Q_Season = models.q_season || model("q_season", Q_LeagueSchema);

export default Q_Season;
