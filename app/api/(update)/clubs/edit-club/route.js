import { connectToDb } from "@/utils/database";
import queryOneClub from "@/utils/db-queries/query-one/club/query-one-club";
import queryOneUser from "@/utils/db-queries/query-one/user/queryOneUser";
import nextResponse from "@/utils/api/next-response";

let db;

export const PATCH = async (req) => {
  const { clubName, coachName, teamAcronym, teamLogo, teamBanner } =
    await req.json();

  try {
    db = await connectToDb();

    const club = await queryOneClub(clubName);
    console.log(club);
    if (!club) {
      return nextResponse({ message: "Team does not exist.." }, 400, "PATCH");
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

    return nextResponse(club, 200, "PATCH");
  } catch (error) {
    return nextResponse({ message: error.message }, 500, "PATCH");
  } finally {
    if (db) {
      db.close();
    }
  }
};
