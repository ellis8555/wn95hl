import { connectToDb } from "@/utils/database";
import getSeasonsModel from "@/schemas/season/season";
import nextResponse from "@/utils/api/next-response";
import queryForIfSeasonExists from "@/utils/db-queries/query-one/season/query-for-a-season";

let db;

export const PATCH = async (req, res) => {
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

    const getLeaguesModel = getSeasonsModel(leagueName);
    const fetchSeason = await getLeaguesModel.findOne({
      seasonNumber: seasonNumber,
    });

    // const season = seasonData[0];
    const seasonData = fetchSeason;

    // get the array that contains each teams current record
    const teamsRecords = seasonData["standings"];
    const categoriesToReset = ["GP", "W", "L", "T", "OTL", "Pts"];
    // reset the categories listed back to 0
    teamsRecords.forEach((team) => {
      categoriesToReset.forEach((category) => {
        team[category] = 0;
      });
    });

    // update the database
    await getLeaguesModel.updateOne(
      { _id: seasonData._id },
      {
        $set: {
          standings: teamsRecords,
          seasonGames: [],
          startDate: null,
        },
      }
    );

    return nextResponse("League table has been reset..", 200, "PATCH");
  } catch (error) {
    return nextResponse(error.message, 500, "PATCH");
  } finally {
    if (db) {
      db.close();
    }
  }
};
