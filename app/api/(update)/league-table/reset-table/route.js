import { connectToDb } from "@/utils/database";
import nextResponse from "@/utils/api/next-response";
import W_Season from "@/schemas/season/w_season";
import {
  CLEAR_LEAGUE_TABLE_SWITCH,
  LEAGUE_TABLE_CATEGORIES,
} from "@/utils/constants/constants";

let db;

export const PATCH = async (req, res) => {
  const { searchParams } = new URL(req.url);
  const leagueName = searchParams.get("league");
  const seasonNumber = searchParams.get("season-number");

  if (!leagueName) {
    throw new Error("A league name needs to be given");
  }

  try {
    db = await connectToDb();

    const League = W_Season;

    const fetchSeason = await League.findOne({
      seasonNumber: seasonNumber,
    });
    if (!fetchSeason) {
      throw new Error(`Season ${seasonNumber} has not been found`);
    }

    // const season = seasonData[0];
    const seasonData = fetchSeason;
    // get the array that contains each teams current recorde
    const teamsRecords = seasonData["standings"];
    const categoriesToReset = LEAGUE_TABLE_CATEGORIES;
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
