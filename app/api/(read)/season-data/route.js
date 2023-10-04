// returns entire seaon object if field is not defined
// return field via field param that goes through a switch

import { connectToDb } from "@/utils/database";
import nextResponse from "@/utils/api/next-response";
import W_Season from "@/schemas/season/w_season";

let db;

export const GET = async (req, res) => {
  const { searchParams } = new URL(req.url);
  const leagueName = searchParams.get("league");
  const seasonNumber = searchParams.get("season-number");
  const getField = searchParams.get("field");
  if (!leagueName) {
    return nextResponse(
      { message: `There is an issue with the league name` },
      500,
      "GET"
    );
  }
  if (!seasonNumber) {
    return nextResponse(
      { message: `There is an issue with the season number` },
      500,
      "GET"
    );
  }

  try {
    db = await connectToDb();

    const seasonData = await W_Season.findOne({ seasonNumber });

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

    // var that will hold the data that is returned depending on the case
    let requestedData;

    switch (getField) {
      // gets each teams 3 letter abbreviation
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
      // get leagues current standings
      case "standings":
        // object which will contain each teams conference and division
        const leagueStructure = {};
        seasonData["teams"].forEach((team) => {
          leagueStructure[team.teamAcronym] = {
            conference: team["conference"],
            division: team["division"],
          };
        });
        // the actual standings array
        const standings = seasonData["standings"];
        // return standings and league structure in a single object
        requestedData = {
          standings: standings,
          leagueStructure: leagueStructure,
        };
        break;
      // get recent league game results
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
