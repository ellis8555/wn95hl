import { connectToDb } from "@/utils/database";
import nextResponse from "@/utils/api/next-response";
import {
  DEFAULT_LEAGUE,
  MOST_RECENT_SEASON,
} from "@/utils/constants/constants";
import { LEAGUE_SCHEMA_SWITCH } from "@/utils/constants/data-calls/db_calls";

export const GET = async (req, { params }) => {
  // this will be the object that is returned

  let requestedData = {};

  // check if api path requires default or specific league/sesason
  const isParams = Object.keys(params).length;

  //////////////////////////////////////////////////////////
  // if no params have been requested return default league
  ////////////////////////////////////////////////////////

  if (isParams === 0) {
    try {
      await connectToDb();
      // grab correct league schema in order to get the correct seasons data
      const League = await LEAGUE_SCHEMA_SWITCH(DEFAULT_LEAGUE);

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
    }
  }

  ////////////////////////////////////////
  // a specific league has been requested
  ////////////////////////////////////////

  if (isParams === 1) {
    const requestedLeagueDetails = params.league;
    const [leagueName, seasonNumber] = requestedLeagueDetails;

    try {
      await connectToDb();
      // grab correct league schema in order to get the correct seasons data
      const League = await LEAGUE_SCHEMA_SWITCH(leagueName);
      // schema method to determine if season exists

      const doesSeasonExist = await League.queryForIfSeasonExists(seasonNumber);
      if (!doesSeasonExist) {
        return nextResponse(
          { message: "League or season number have not been found" },
          500,
          "GET"
        );
      }

      //////////////////////////////////////////////////////////////////
      // schema method takes in parameter list and requestedData object
      // requestedData object has properties added within this method
      //////////////////////////////////////////////////////////////////

      const response = await League.getFieldData(
        seasonNumber,
        requestedLeagueDetails,
        requestedData
      );

      if (response.error) {
        return nextResponse(response, 400, "GET");
      } else {
        return nextResponse(response, 200, "GET");
      }

      // return requested data
    } catch (error) {
      return nextResponse(error.message, 500, "GET");
    }
  }
};
