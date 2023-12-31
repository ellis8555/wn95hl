import { connectToDb } from "@/utils/database";
import { READ_SEASON_FIELD_DATA } from "@/utils/constants/data-calls/db_calls";

export const revalidate = 0;

export const getRecentGameResults = async function (leagueName, seasonNumber) {
  await connectToDb();

  const { recentlyPlayedGames, totalGamesSubmitted } =
    await READ_SEASON_FIELD_DATA(leagueName, seasonNumber, "recent-results");

  const gameData = {
    recentlyPlayedGames,
    totalGamesSubmitted,
  };
  return JSON.stringify(gameData);
};
