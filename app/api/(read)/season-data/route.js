// returns entire season object if field is not defined
// return field via field param that goes through a switch

import { connectToDb } from "@/utils/database";
import nextResponse from "@/utils/api/next-response";
import W_Season from "@/schemas/season/w_season";
import {
  MOST_RECENT_SEASON,
  LEAGUE_SCHEMA_SWITCH,
} from "@/utils/constants/constants";

let db;

export const GET = async (req, res) => {
  const { searchParams } = new URL(req.url);
  let leagueName = searchParams.get("league");
  let seasonNumber = searchParams.get("season-number");
  const getField = searchParams.get("field");

  try {
    db = await connectToDb();

    // grab correct league schema in order to get the correct seasons data
    const League = LEAGUE_SCHEMA_SWITCH(leagueName, W_Season);

    // if no seasonNumber parameter set to most recent season
    if (seasonNumber == MOST_RECENT_SEASON) {
      const seasons = await League.find({}, "seasonNumber");
      const seasonsList = seasons.map((season) => {
        return season.seasonNumber;
      });
      seasonNumber = Math.max(...seasonsList).toString();
    }

    // get season data from correct league and season number
    const seasonData = await League.findOne({ seasonNumber });

    if (!seasonData) {
      return nextResponse(
        { message: `Season ${seasonNumber} has not been found` },
        500,
        "GET"
      );
    }

    //////////////////////////////////////////////////////////////////////////
    // switch takes field key from url params responds depending on the value
    //////////////////////////////////////////////////////////////////////////

    // 1. teamDictCodes
    // 2. standings
    // 3. teamsConferenceAndDivisions
    // 4. recent-results
    // 5. most-recent-season

    // var that will hold the data that is returned depending on the case
    let requestedData;

    switch (getField) {
      /////////////////////////////////////////
      // gets each teams 3 letter abbreviation
      /////////////////////////////////////////
      case "teamsDictCodes":
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
        requestedData = seasonData[getField];
        break;
      /////////////////////////////////
      // get leagues current standings
      /////////////////////////////////
      case "standings":
        // the actual standings array
        const standings = seasonData["standings"];
        // return standings and league structure in a single object
        requestedData = standings;
        break;
      ///////////////////////////////////////////////////////////////
      // gets conferences and divisions for the league and the season
      ///////////////////////////////////////////////////////////////
      case "teams-conferences-and-divisions":
        // object which will contain each teams conference and division
        const leagueStructure = {};
        seasonData["teams"].forEach((team) => {
          leagueStructure[team.teamAcronym] = {
            conference: team["conference"],
            division: team["division"],
          };
        });
        requestedData = leagueStructure;
        break;
      ////////////////////////////////////
      // get recent league game results
      ////////////////////////////////////
      case "recent-results":
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

        requestedData = recentlyPlayedGames;

        break;
      ////////////////////////////////////////
      // gets the most recent season
      ////////////////////////////////////////
      case "most-recent-season":
        requestedData = seasonNumber;
        break;
      default:
        requestedData = seasonData;
    }

    return nextResponse(requestedData, 200, "GET");
  } catch (error) {
    return nextResponse(error.message, 500, "GET");
  } finally {
    if (db) {
      db.close();
    }
  }
};
