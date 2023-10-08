import { connectToDb } from "@/utils/database";
import nextResponse from "@/utils/api/next-response";
import W_Season from "@/schemas/season/w_season";
import {
  DEFAULT_LEAGUE,
  LEAGUE_SCHEMA_SWITCH,
} from "@/utils/constants/constants";

let db;

export const GET = async (req, res) => {
  const { searchParams } = new URL(req.url);
  let leagueName = searchParams.get("league");
  let seasonNumber = searchParams.get("season-number");

  // if no leagueName paramter set the default as per constant defined
  if (!leagueName) {
    leagueName = "w";
  }
  // grab correct league schema in order to get the correct seasons data
  const League = LEAGUE_SCHEMA_SWITCH(DEFAULT_LEAGUE, W_Season);
  // if no seasonNumber parameter set to most recent season
  if (!seasonNumber) {
    const seasons = await League.find({}, "seasonNumber");
    const seasonsList = seasons.map((season) => {
      return season.seasonNumber;
    });
    seasonNumber = Math.max(...seasonsList).toString();
  }

  try {
    db = await connectToDb();

    // get this seasons document
    const seasonData = await League.findOne({ seasonNumber });

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
