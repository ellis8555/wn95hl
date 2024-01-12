import { connectToDb } from "@/utils/database";
import nextResponse from "@/utils/api/next-response";
import { LEAGUE_SCHEMA_SWITCH } from "@/utils/constants/data-calls/db_calls";

const dbCallFrom = "api read clubs/in-a-season";

export const GET = async (req, res) => {
  const { searchParams } = new URL(req.url);
  let leagueName = searchParams.get("league");
  let seasonNumber = searchParams.get("season-number");

  // grab correct league schema in order to get the correct seasons data
  const League = await LEAGUE_SCHEMA_SWITCH(leagueName);
  // if no seasonNumber parameter set to most recent season
  if (!seasonNumber) {
    const seasons = await League.find({}, "seasonNumber");
    const seasonsList = seasons.map((season) => {
      return season.seasonNumber;
    });
    seasonNumber = Math.max(...seasonsList).toString();
  }

  try {
    await connectToDb(dbCallFrom);

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
  }
};
