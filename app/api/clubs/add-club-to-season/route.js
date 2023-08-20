import { connectToDb } from "@/utils/database";
import getSeasonsModel from "@/schemas/season/season";
import queryIfClubExists from "@/utils/db-queries/query-one/club/query-if-club-exists";
import nextResponse from "@/utils/api/next-response";

let db;

export const POST = async (req) => {
  const { teamName, teamAcronym, seasonNumber } = await req.json();

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

    const Season = getSeasonsModel(seasonNumber);

    // check if season has been created in the database
    let thisSeason = await Season.findOne({});
    if (!thisSeason) {
      thisSeason = new Season({});
    }

    // check if team has already been added to the season
    const isTeamRegistered = thisSeason.teams.includes(teamName);

    if (isTeamRegistered) {
      return nextResponse(
        {
          message: "Team is already registered for this season",
        },
        400,
        "POST"
      );
    }

    // add team name to list of teams array
    thisSeason.teams.push(teamName);

    // add team to the standings array

    thisSeason.standings.push({ teamName: teamName, teamAcronym: teamAcronym });

    // update the seasons document
    await thisSeason.save();

    return nextResponse(
      { message: `Team has been added to season ${seasonNumber}` },
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
