import { connectToDb } from "@/utils/database";
import nextResponse from "@/utils/api/next-response";
import {
  DEFAULT_LEAGUE,
  MOST_RECENT_SEASON,
} from "@/utils/constants/constants";
import { LEAGUE_SCHEMA_SWITCH } from "@/utils/constants/api_consts";

export const GET = async (req, { params }) => {
  // this will be the object that is returned
  // list of proptertis so far contained within this object
  // 1. standings
  // 2. divisionsAndConferences
  // 3. dictCodes
  // 4. recentlyPlayedGames
  let requestedData = {};

  // check if api path requires default or specific league/sesason
  // if length is zero then return default league most recent season
  const isParams = Object.keys(params).length;

  //////////////////////////////////////////////////////////
  // if no params have been requested return default league
  ////////////////////////////////////////////////////////

  if (isParams === 0) {
    let db;

    try {
      const db = await connectToDb();
      // grab correct league schema in order to get the correct seasons data
      const League = LEAGUE_SCHEMA_SWITCH(DEFAULT_LEAGUE);

      // schema method to determine if season exists

      const doesSeasonExist = await League.queryForIfSeasonExists(
        MOST_RECENT_SEASON
      );
      if (!doesSeasonExist) {
        return nextResponse(
          { message: "League or season number have not been found" },
          500,
          "GET"
        );
      }

      // schema static to add current seasons standings

      requestedData.standings = await League.getSortedStandings(
        MOST_RECENT_SEASON
      );

      // return requested data

      return nextResponse(requestedData, 200, "GET");
    } catch (error) {
      return nextResponse(error.message, 500, "GET");
    } finally {
      if (db) {
        db.close();
      }
    }
  }

  ////////////////////////////////////////
  // a specific league has been requested
  ////////////////////////////////////////

  if (isParams > 0) {
    const requestedLeagueDetails = params.league;
    const [leagueName, seasonNumber] = requestedLeagueDetails;

    let db;

    try {
      const db = await connectToDb();
      // grab correct league schema in order to get the correct seasons data
      const League = LEAGUE_SCHEMA_SWITCH(leagueName);

      // schema method to determine if season exists

      const doesSeasonExist = await League.queryForIfSeasonExists(seasonNumber);
      if (!doesSeasonExist) {
        return nextResponse(
          { message: "League or season number have not been found" },
          500,
          "GET"
        );
      }

      // schema static to add current seasons standings

      requestedData.standings = await League.getSortedStandings(seasonNumber);

      //////////////////////////////////////////////////////////////////
      // schema method takes in parameter list and requestedData object
      // requestedData object has properties added within this method
      //////////////////////////////////////////////////////////////////

      if (requestedLeagueDetails.length > 2) {
        await League.getFieldData(
          seasonNumber,
          requestedLeagueDetails,
          requestedData
        );
      }

      // return requested data

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
