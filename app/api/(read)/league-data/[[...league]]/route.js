import { connectToDb } from "@/utils/database";
import nextResponse from "@/utils/api/next-response";
import nextResponseHTMX from "@/utils/api/next-response-htmx";
import {
  DEFAULT_LEAGUE,
  MOST_RECENT_SEASON,
  LEAGUE_HTMX_TABLE_CATEGORIES,
} from "@/utils/constants/constants";
import {
  LEAGUE_SCHEMA_SWITCH,
  LEAGUE_GAMES_SCHEMA_SWITCH,
} from "@/utils/constants/data-calls/db_calls";

const dbCallFrom = "api read league-data/[[...league]]";

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
      await connectToDb(dbCallFrom);
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
      await connectToDb(dbCallFrom);
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

      let response;

      // if request is game file upload then return recent results AND updated standings
      if (
        params.league.includes("recent-results") &&
        params.league.includes("standings")
      ) {
        // get correct games schema
        const Games = await LEAGUE_GAMES_SCHEMA_SWITCH(leagueName);
        // fetch recent games for the league
        await Games.getFieldData(
          seasonNumber,
          requestedLeagueDetails,
          // requested data is empty object declared higher up which has data appended to it then returned
          requestedData
        );
        // get the most recent standings
        await League.getFieldData(
          seasonNumber,
          requestedLeagueDetails,
          // requested data is empty object declared higher up which has data appended to it then returned
          requestedData
        );
        // place both recent results and standings inside of variable
        response = requestedData;
      } else if (params.league.includes("recent-results")) {
        const Games = await LEAGUE_GAMES_SCHEMA_SWITCH(leagueName);
        response = await Games.getFieldData(
          seasonNumber,
          requestedLeagueDetails,
          // requested data is empty object declared higher up which has data appended to it then returned
          requestedData
        );
      } else {
        response = await League.getFieldData(
          seasonNumber,
          requestedLeagueDetails,
          // requested data is empty object declared higher up which has data appended to it then returned
          requestedData
        );
      }

      if (response.error) {
        return nextResponse(response, 400, "GET");
      } else {
        // check if request is from magnus official page
        // origin/api/league-data/w/3/standings/htmx
        if (params.league.includes("htmx")) {
          const standingsTableHTML = `
          <table class="table-auto mx-auto">
            <thead>
              <tr>
                ${LEAGUE_HTMX_TABLE_CATEGORIES.map(
                  (category) => `<th class="py-2 px-4">${category}</th>`
                ).join("")}
              </tr>
            </thead>
            <tbody>
              ${response.standings
                .map(
                  (standing, index) => `
                    <tr ${
                      index === 15 ? 'class="border-black border-b-2"' : ""
                    }>
                      ${LEAGUE_HTMX_TABLE_CATEGORIES.map((category) => {
                        if (category === "Team") {
                          // return `<td class="mx-2 py-2 ps-2">${standing["teamName"]}</td>`;
                          return `<td class="mx-2 py-2 ps-2">
                            <img src=${standing["googleDriveLogo"]} style="width:150px; height:30px" alt=${standing["teamName"]}/>
                          </td>`;
                        } else {
                          return `<td class="text-center mx-2 py-2">${standing[category]}</td>`;
                        }
                      }).join("")}
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>
        `;
          return nextResponseHTMX(standingsTableHTML, 200, "GET");
        } else {
          // return json standings data for next js page
          // origin/api/league-data/w/3/standings
          return nextResponse(response, 200, "GET");
        }
      }

      // return requested data
    } catch (error) {
      return nextResponse(error.message, 500, "GET");
    }
  }
};
