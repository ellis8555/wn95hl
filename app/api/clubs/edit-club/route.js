import { connectToDb } from "@/utils/database";
import { NextResponse } from "next/server";
import queryOneClub from "@/utils/db-queries/query-one/club/query-one-club";
import queryOneUser from "@/utils/db-queries/query-one/user/queryOneUser";

let db;

export const PATCH = async (req) => {
  const { clubName, coachName, teamAcronym, teamLogo, teamBanner } =
    await req.json();

  try {
    db = await connectToDb();

    const club = await queryOneClub(clubName);

    if (!club) {
      return NextResponse.json(
        { message: "Team does not exist.." },
        {
          status: 400,
        }
      );
    }

    if (coachName) {
      const coach = await queryOneUser(coachName);
      club.coachId = coach._id;
    }

    if (teamAcronym) {
      club.teamAcronym = teamAcronym;
    }

    if (teamLogo) {
      club.teamLogo = teamLogo;
    }

    if (teamBanner) {
      club.teamBanner = teamBanner;
    }

    await club.save();

    return NextResponse.json(club, {
      status: 200,
    });
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
