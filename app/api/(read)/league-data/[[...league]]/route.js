import { connectToDb } from "@/utils/database";
import nextResponse from "@/utils/api/next-response";
import { NextResponse } from "next/server";
import nextResponseHTMX from "@/utils/api/next-response-htmx";
import fs from 'fs';
import path from 'path'
import { DOMAIN } from "@/utils/constants/connections"
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
        return nextResponse(requestedData, 200, "GET")
      } else if (params.league.includes("recent-results")) {
        const Games = await LEAGUE_GAMES_SCHEMA_SWITCH(leagueName);
        response = await Games.getFieldData(
          seasonNumber,
          requestedLeagueDetails,
          // requested data is empty object declared higher up which has data appended to it then returned
          requestedData
        );
        return nextResponse(response, 200, "GET")
      } else if (params.league.includes("team-codes")) {
        response = await League.getFieldData(
          seasonNumber,
          requestedLeagueDetails,
          // requested data is empty object declared higher up which has data appended to it then returned
          requestedData
        );
        return nextResponse(response, 200, "GET")
      }  else if(params.league.includes("csv-game-data")){
        // get game return count from user via the url params
        const howManyGamesToReturn = requestedLeagueDetails[3];
        // get correct games schema
        const Games = await LEAGUE_GAMES_SCHEMA_SWITCH(leagueName);
        const response = await Games.getCsvGameData(seasonNumber, howManyGamesToReturn);
        return new NextResponse(response, {
          status: 200,
          statusText: "OK",
          headers: new Headers({
            "Content-Type": "text/csv",
            "Access-Control-Allow-Origin": "*",
            "Content-Disposition": 'attachment; filename="WN95HL_Game_Stats.csv'
          }),
        })
      }else if (params.league.includes("goalies-csv")) {

          const pathName = path.join(process.cwd(), 'public', 'csv', `${leagueName}`, `${seasonNumber}`, 'Goalie_Attributes.csv')
        const goalieData = fs.readFileSync(pathName, "utf8");

        return new NextResponse(goalieData, {
          status: 200,
          statusText: "OK",
          headers: new Headers({
            "Content-Type": "text/csv",
            "Access-Control-Allow-Origin": "*",
          }),
        });
      } else if (params.league.includes("skaters-csv")) {

          const pathName = path.join(process.cwd(), 'public', 'csv', `${leagueName}`, `${seasonNumber}`, 'Skater_Attributes.csv')
        const skaterData = fs.readFileSync(pathName, "utf8");

        return new NextResponse(skaterData, {
          status: 200,
          statusText: "OK",
          headers: new Headers({
            "Content-Type": "text/csv",
            "Access-Control-Allow-Origin": "*",
          }),
        });
      } else if (params.league.includes("team-position-csv")) {
          const pathName = path.join(process.cwd(), 'public', 'csv', `${leagueName}`, `${seasonNumber}`, 'Team_Position_Counts.csv')
        const positionCounts = fs.readFileSync(pathName, "utf8");

        return new NextResponse(positionCounts, {
          status: 200,
          statusText: "OK",
          headers: new Headers({
            "Content-Type": "text/csv",
            "Access-Control-Allow-Origin": "*",
          }),
        });
        // check if request is from magnus official page
        // origin/api/league-data/w/3/standings/htmx
      } else if (params.league.includes("htmx-standings")) {
        const standings = await League.getSortedStandings(seasonNumber)
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
              ${standings
                .map(
                  (standing, index) => `
                    <tr ${
                      index === 15 ? 'class="border-black border-b-2"' : ""
                    }>
                      ${LEAGUE_HTMX_TABLE_CATEGORIES.map((category) => {
                        if (category === "Team") {
                          // get teams banner from this api
                          const teamLogoSrc = `${DOMAIN}/api/team-banner/${standing["teamLogo"]}`;
                          return `<td class="mx-2 py-2 ps-2">
                            <img src=${teamLogoSrc} style="width:150px; height:30px" alt=${standing["teamName"]}/>
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
        }       // returns table filtered by conference
                // concerence name needs to be added to the url
                // ex. ..league-data/w/2/htmx-conference-standings/Prince%20of%20Wales
        else if (params.league.includes("htmx-conference-standings")) {
          const conferenceName = params.league[3];
          const filteredByConferenceStandings = await League.getSortedConferenceStandings(seasonNumber, conferenceName);
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
              ${filteredByConferenceStandings
                .map(
                  (standing, index) => `
                    <tr ${
                      index === 7 ? 'class="border-black border-b-2"' : ""
                    }>
                      ${LEAGUE_HTMX_TABLE_CATEGORIES.map((category) => {
                        if (category === "Team") {
                          // get teams banner from this api
                          const teamLogoSrc = `${DOMAIN}/api/team-banner/${standing["teamLogo"]}`;
                          return `<td class="mx-2 py-2 ps-2">
                            <img src=${teamLogoSrc} style="width:150px; height:30px" alt=${standing["teamName"]}/>
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
        } else
         {
          ///////////////////////////////////
          // need to edit this last response
          ///////////////////////////////////
          throw Error("Url slug not recognized")
        }
      }
     catch (error) {
      return nextResponse(error.message, 500, "GET");
    }
  }
};
