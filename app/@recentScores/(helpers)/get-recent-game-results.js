import { cache } from "react";
import { connectToDb } from "@/utils/database";
import { READ_SEASON_FIELD_DATA } from "@/utils/constants/api_consts";

export const revalidate = 1;

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
