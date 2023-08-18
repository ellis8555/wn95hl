import { connectToDb } from "@/utils/database";
import { NextResponse } from "next/server";
import getSeasonsModel from "@/schemas/season/season";
import queryIfClubExists from "@/utils/db-queries/query-one/club/query-if-club-exists";

let db;

export const POST = async (req) => {
  const { teamName, teamAcronym, seasonNumber } = await req.json();

  try {
    db = await connectToDb();

    // check that team name exists
    const searchIfTeamExists = await queryIfClubExists(teamName);
    if (!searchIfTeamExists) {
      return NextResponse.json(
        { message: "This team is not registered.." },
        {
          status: 400,
        }
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
      return NextResponse.json({
        message: "Team is already registered for this season",
      });
    }

    // add team name to list of teams array
    thisSeason.teams.push(teamName);

    // add team to the standings array

    thisSeason.standings.push({ teamName: teamName, teamAcronym: teamAcronym });

    // update the seasons document
    await thisSeason.save();

    return NextResponse.json(
      { message: `Team has been added to season ${seasonNumber}` },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } finally {
    if (db) {
      db.close();
    }
  }
};
