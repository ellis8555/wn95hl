import { connectToDb } from "@/utils/database";
import nextResponse from "@/utils/api/next-response";
import W_Season from "@/schemas/season/w_season";
import {
  DEFAULT_LEAGUE,
  LEAGUE_SCHEMA_SWITCH,
  MOST_RECENT_SEASON,
} from "@/utils/constants/constants";

export const GET = async (req, { params }) => {
  // this will be the object that is returned
  let requestedData = {};
  // set once it's known which league is requested
  let leagueName, seasonNumber;

  // check if api path requires default or specific league/sesason
  // if length is zero then return default league most recent season
  const isParams = Object.keys(params).length;

  // return default league and most recent season details
  if (isParams === 0) {
    //////////////////
    // to be filled in
    //////////////////
    // grab correct league schema in order to get the correct seasons data
    const League = LEAGUE_SCHEMA_SWITCH(DEFAULT_LEAGUE, W_Season);
    // get season data from correct league and season number
    const seasonData = await League.findOne({
      seasonNumber: MOST_RECENT_SEASON,
    });
    /////////////////////////////////
    // add current seasons standings
    /////////////////////////////////
    requestedData.standings = seasonData["standings"];
  }

  // a specific league has been requested
  if (isParams > 0) {
    const requestedLeagueDetails = params.league;
    [leagueName, seasonNumber] = requestedLeagueDetails;

    let db;

    try {
      const db = await connectToDb();

      // grab correct league schema in order to get the correct seasons data
      const League = LEAGUE_SCHEMA_SWITCH(leagueName, W_Season);

      // get season data from correct league and season number
      const seasonData = await League.findOne({ seasonNumber });

      if (!seasonData) {
        return nextResponse(
          { message: "League or season number have not been found" },
          500,
          "GET"
        );
      }
      /////////////////////////////////
      // add current seasons standings
      /////////////////////////////////
      requestedData.standings = seasonData["standings"];

      //////////////////////////////////////////////////////////////////////////
      // switch takes field key from url params responds depending on the value
      //////////////////////////////////////////////////////////////////////////

      // 1. teams-conferences-and-divisions
      // 2. team-codes
      // 3. recent-results
      // 4. most-recent-season

      /////////////////////////////////////////////////////
      // if divisions and conferences are required then add
      /////////////////////////////////////////////////////
      if (requestedLeagueDetails.includes("teams-conferences-and-divisions")) {
        const leagueStructure = {};
        seasonData["teams"].forEach((team) => {
          leagueStructure[team.teamAcronym] = {
            conference: team["conference"],
            division: team["division"],
          };
        });
        requestedData.divisionsAndConferences = leagueStructure;
      }

      ////////////////////////////////////////
      // if teams dictCodes required then add
      ////////////////////////////////////////
      if (requestedLeagueDetails.includes("team-codes")) {
        if (!seasonData.hasSeasonBegun) {
          return nextResponse(
            {
              message: `Season ${seasonNumber} of the ${leagueName.toUpperCase()} has not officially began.`,
            },
            400,
            "GET"
          );
        }
        if (seasonData.hasSeasonEnded) {
          return nextResponse(
            {
              message: `Season ${seasonNumber} of the ${leagueName.toUpperCase()} has officially ended.`,
            },
            400,
            "GET"
          );
        }
        requestedData.dictCodes = seasonData["teamsDictCodes"];
      }
      //////////////////////////////////
      // if recent results are required
      //////////////////////////////////
      if (requestedLeagueDetails.includes("recent-results")) {
        const howManyGamesPlayed = seasonData["seasonGames"].length;

        let recentlyPlayedGames = [];
        if (howManyGamesPlayed < 8) {
          seasonData["seasonGames"].forEach((game) =>
            recentlyPlayedGames.push(game)
          );
        } else {
          recentlyPlayedGames = seasonData["seasonGames"].slice(
            howManyGamesPlayed - 8
          );
        }

        requestedData.recentlyPlayedGames = recentlyPlayedGames;
      }

      ////////////////////////////
      // return requested data
      ////////////////////////////

      return nextResponse(requestedData, 200, "GET");
    } catch (error) {
      return nextResponse(error.message, 500, "GET");
    } finally {
      if (db) {
        db.close();
      }
    }
  }
};
