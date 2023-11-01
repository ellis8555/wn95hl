import { cache } from "react";
import { READ_SEASON_STANDINGS } from "@/utils/constants/data-calls/db_calls";

export const revalidate = 0;

export const getStandings = cache(async function (leagueName, seasonNumber) {
  const standings = await READ_SEASON_STANDINGS(leagueName, seasonNumber);

  return JSON.stringify(standings);
});
