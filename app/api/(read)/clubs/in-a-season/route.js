import { connectToDb } from "@/utils/database";
import nextResponse from "@/utils/api/next-response";
import getSeasonsModel from "@/schemas/season/season";
import queryForIfSeasonExists from "@/utils/db-queries/query-one/season/query-for-a-season";

let db;

export const GET = async (req, res) => {
  const { searchParams } = new URL(req.url);
  const leagueName = searchParams.get("league");
  const seasonNumber = searchParams.get("season-number");

  try {
    db = await connectToDb();

    // check season number is valid
    const doesSeasonExist = await queryForIfSeasonExists(
      leagueName,
      seasonNumber
    );

    if (!doesSeasonExist) {
      throw new Error(`Season ${seasonNumber} has not been found`);
    }

    // get this seasons document
    const Season = getSeasonsModel(leagueName);
    const seasonData = await Season.findOne({ seasonNumber: seasonNumber });
    // extract teams array of team objects
    const teamsDictCodes = seasonData.teamsDictCodes;
    let i = 0;
    return nextResponse(teamsDictCodes, 200, "GET");
  } catch (error) {
    return nextResponse({ message: error.message }, 500, "GET");
  } finally {
    if (db) {
      db.close();
    }
  }
};
