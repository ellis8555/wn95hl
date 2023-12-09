import { connectToDb } from "@/utils/database";
import { READ_SEASON_GAME_RESULTS } from "@/utils/constants/data-calls/db_calls";

export const revalidate = 0;

export const getGameResults = async function (
  leagueName,
  seasonNumber,
  gamesIndexNumber
) {
  await connectToDb();

  const { selectedGames, totalGamesSubmitted } = await READ_SEASON_GAME_RESULTS(
    leagueName,
    seasonNumber,
    gamesIndexNumber
  );

  const gameData = {
    selectedGames,
    totalGamesSubmitted,
  };
  return JSON.stringify(gameData);
};
