import { connectToDb } from "@/utils/database";
import getSeasonsModel from "@/schemas/season/season";
import nextResponse from "@/utils/api/next-response";
import queryForIfSeasonExists from "@/utils/db-queries/query-one/season/query-for-a-season";

let db;

export const GET = async (req, res) => {
  const { searchParams } = new URL(req.url);
  const leagueName = searchParams.get("league");
  const seasonNumber = searchParams.get("season-number");
  try {
    db = await connectToDb();
    const doesSeasonExist = await queryForIfSeasonExists(
      leagueName,
      seasonNumber
    );

    if (!doesSeasonExist) {
      throw new Error(`Season ${seasonNumber} has not been found`);
    }
    const Season = getSeasonsModel(leagueName);
    const seasonData = await Season.findOne({ seasonNumber: seasonNumber });

    return nextResponse(seasonData, 200, "GET");
  } catch (error) {
    return nextResponse(error.message, 500, "GET");
  } finally {
    if (db) {
      db.close();
    }
  }
};
