import { connectToDb } from "@/utils/database";
import getSeasonsModel from "@/schemas/season/season";
import nextResponse from "@/utils/api/next-response";

let db;

export const GET = async (req, res) => {
  const { searchParams } = new URL(req.url);
  const leagueName = searchParams.get("league");

  try {
    db = await connectToDb();

    const SeasonModel = getSeasonsModel(leagueName);
    const seasonData = await SeasonModel.find({});

    return nextResponse(seasonData, 200, "GET");
  } catch (error) {
    return nextResponse(error.message, 500, "GET");
  } finally {
    if (db) {
      db.close();
    }
  }
};
