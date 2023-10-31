import { cache } from "react";
import { connectToDb } from "@/utils/database";
import { READ_SEASON_FIELD_DATA } from "@/utils/constants/data-calls/db_calls";

export const revalidate = 0;

export const getRecentGameResults = cache(async function (
  leagueName,
  seasonNumber
) {
  await connectToDb();

  const { recentlyPlayedGames } = await READ_SEASON_FIELD_DATA(
    leagueName,
    seasonNumber,
    "recent-results"
  );
  return JSON.stringify(recentlyPlayedGames);
});