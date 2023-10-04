import { connectToDb } from "@/utils/database";
import nextResponse from "@/utils/api/next-response";
import W_Season from "@/schemas/season/w_season";

let db;

export const GET = async (req, res) => {
  const { searchParams } = new URL(req.url);
  const leagueName = searchParams.get("league");
  const seasonNumber = searchParams.get("season-number");

  try {
    db = await connectToDb();

    // get this seasons document
    const seasonData = await W_Season.findOne({ seasonNumber });

    if (!seasonData) {
      throw new Error(`Season ${seasonNumber} has not been found`);
    }

    // extract teams array of team objects
    const teamsDictCodes = seasonData.teamsDictCodes;

    return nextResponse(teamsDictCodes, 200, "GET");
  } catch (error) {
    return nextResponse({ message: error.message }, 500, "GET");
  } finally {
    if (db) {
      db.close();
    }
  }
};
