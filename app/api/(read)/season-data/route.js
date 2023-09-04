// requires 3 url params
// league name, season number, and field to return from a season

import { connectToDb } from "@/utils/database";
import getSeasonsModel from "@/schemas/season/season";
import nextResponse from "@/utils/api/next-response";
import queryForIfSeasonExists from "@/utils/db-queries/query-one/season/query-for-a-season";

let db;

export const GET = async (req, res) => {
  const { searchParams } = new URL(req.url);
  const leagueName = searchParams.get("league");
  const seasonNumber = searchParams.get("season-number");
  const getField = searchParams.get("field");

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

    // var that will hold the data that is returned depending on the case
    let requestedData;
    switch (getField) {
      case "teamsDictCodes":
        if (!seasonData.hasSeasonBegun) {
          return nextResponse(
            {
              message: `Season ${seasonNumber} of the ${leagueName.toUpperCase()} has not officially began.`,
            },
            400,
            "GET"
          );
        }
        if (seasonData.hasSeasonEnded) {
          return nextResponse(
            {
              message: `Season ${seasonNumber} of the ${leagueName.toUpperCase()} has officially ended.`,
            },
            400,
            "GET"
          );
        }
        requestedData = seasonData[getField];
        break;
      case "standings":
        requestedData = seasonData[getField];
        break;
    }

    return nextResponse(requestedData, 200, "GET");
  } catch (error) {
    return nextResponse(error.message, 500, "GET");
  } finally {
    if (db) {
      db.close();
    }
  }
};
