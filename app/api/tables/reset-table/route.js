import { connectToDb } from "@/utils/database";
import getSeasonsModel from "@/schemas/season/season";
import nextResponse from "@/utils/api/next-response";

let db;

export const PATCH = async (req, res) => {
  try {
    db = await connectToDb();

    const SeasonModel = getSeasonsModel(8);
    const seasonData = await SeasonModel.find({});

    const season = seasonData[0];

    // get the array that contains each teams current record
    const teamsRecords = seasonData[0]["standings"];
    const categoriesToReset = ["GP", "W", "L", "T", "OTL", "Pts"];
    // reset the categories listed back to 0
    teamsRecords.forEach((team) => {
      categoriesToReset.forEach((category) => {
        team[category] = 0;
      });
    });

    // create empty array to replace previous game entries
    const emptySeasonsGames = [];

    // update the database
    await SeasonModel.updateOne(
      { _id: season._id },
      { $set: { standings: teamsRecords, seasonGames: emptySeasonsGames } }
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
