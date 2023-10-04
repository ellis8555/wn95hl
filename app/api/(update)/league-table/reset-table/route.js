import { connectToDb } from "@/utils/database";
import nextResponse from "@/utils/api/next-response";
import W_Season from "@/schemas/season/w_season";

let db;

export const PATCH = async (req, res) => {
  const { searchParams } = new URL(req.url);
  const leagueName = searchParams.get("league");
  const seasonNumber = searchParams.get("season-number");

  try {
    db = await connectToDb();

    const fetchSeason = await W_Season.findOne({
      seasonNumber: seasonNumber,
    });
    if (!fetchSeason) {
      throw new Error(`Season ${seasonNumber} has not been found`);
    }

    // const season = seasonData[0];
    const seasonData = fetchSeason;
    console.log(seasonData._id);
    // get the array that contains each teams current recorde
    const teamsRecords = seasonData["standings"];
    const categoriesToReset = ["GP", "W", "L", "T", "OTL", "Pts"];
    // reset the categories listed back to 0
    teamsRecords.forEach((team) => {
      categoriesToReset.forEach((category) => {
        team[category] = 0;
      });
    });

    // update the database
    fetchSeason.standings = teamsRecords;
    fetchSeason.seasonGames = [];
    fetchSeason.startDate = null;
    await fetchSeason.save();

    return nextResponse("League table has been reset..", 200, "PATCH");
  } catch (error) {
    return nextResponse(error.message, 500, "PATCH");
  } finally {
    if (db) {
      db.close();
    }
  }
};
