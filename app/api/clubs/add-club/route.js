import { connectToDb } from "@/utils/database";
import { NextResponse } from "next/server";
import queryIfClubExists from "@/utils/db-queries/query-one/club/query-if-club-exists";
import queryOneUser from "@/utils/db-queries/query-one/user/queryOneUser";

let db;

export const POST = async (req) => {
  const { name, nickname, teamAcronym, coachName, teamLogo, teamBanner } =
    await req.json();

  try {
    db = await connectToDb();

    // prevent duplicate name from being added
    const searchForIfTeamExists = await queryIfClubExists(name);
    if (searchForIfTeamExists) {
      return NextResponse.json(
        { message: "This team name is taken.." },
        {
          status: 400,
        }
      );
    }

    const getCoachDocument = await queryOneUser(coachName);
    const coachId = getCoachDocument._id;
    const addClub = await new Club({
      name,
      nickname,
      teamAcronym,
      coachId,
      teamLogo,
      teamBanner,
    });
    await addClub.save();

    return NextResponse.json(addClub, {
      status: 200,
    });
  } catch (error) {
    return Response.json(
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
