import { connectToDb } from "@/utils/database";
import queryIfClubExists from "@/utils/db-queries/query-one/club/query-if-club-exists";
import queryOneUser from "@/utils/db-queries/query-one/user/queryOneUser";
import nextResponse from "@/utils/api/next-response";
import Club from "@/schemas/club";

let db;

export const POST = async (req) => {
  const { name, nickname, teamAcronym, coachName, teamLogo, teamBanner } =
    await req.json();

  try {
    db = await connectToDb();

    // prevent duplicate name from being added
    const searchForIfTeamExists = await queryIfClubExists(name);
    if (searchForIfTeamExists) {
      return nextResponse(
        { message: "This team name is taken.." },
        400,
        "POST"
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

    return nextResponse(
      { message: `The ${name} ${nickname} have been added` },
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
