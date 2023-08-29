import { connectToDb } from "@/utils/database";
import getSeasonsModel from "@/schemas/season/season";
import queryOneClub from "@/utils/db-queries/query-one/club/query-one-club";
import queryIfClubExists from "@/utils/db-queries/query-one/club/query-if-club-exists";
import nextResponse from "@/utils/api/next-response";

let db;

export const POST = async (req) => {
  const {
    teamName,
    leagueName,
    seasonNumber: whichSeason,
    conference,
    division,
  } = await req.json();

  try {
    db = await connectToDb();

    // check that team name exists
    const searchIfTeamExists = await queryIfClubExists(teamName);
    if (!searchIfTeamExists) {
      return nextResponse(
        { message: "This team is not registered.." },
        400,
        "POST"
      );
    }

    const Season = getSeasonsModel(leagueName);

    // check if season has been created in the database
    let thisSeason = await Season.findOne({ seasonNumber: whichSeason });
    if (!thisSeason) {
      thisSeason = new Season({});
    }

    // check if team has already been added to the season
    const teamObject = await queryOneClub(teamName);
    const teamAcronym = teamObject.teamAcronym;
    const isTeamRegistered = thisSeason.teams.find(
      (team) => team.teamAcronym === teamAcronym
    );

    if (isTeamRegistered) {
      return nextResponse(
        {
          message: "Team is already registered for this season",
        },
        400,
        "POST"
      );
    }

    // add seasonNumber
    thisSeason.seasonNumber = whichSeason;

    const createTeamsObject = {
      teamAcronym,
      conference,
      division,
    };

    // add team name to list of teams array
    thisSeason.teams.push(createTeamsObject);

    // add team to the standings array

    thisSeason.standings.push({ teamName: teamName, teamAcronym: teamAcronym });
    // update the seasons document
    await thisSeason.save();

    return nextResponse(
      {
        message: `Team has been added to season ${whichSeason} of the ${leagueName}`,
      },
      200,
      "POST"
    );
  } catch (error) {
    return nextResponse({ message: error.message }, 500, "POST");
  } finally {
    if (db) {
      db.close();
    }
  }
};
