import { cache } from "react";
import { READ_SEASON_STANDINGS } from "@/utils/constants/api_consts";

export const revalidate = 1;

export const getStandings = cache(async function (leagueName, seasonNumber) {
  const standings = await READ_SEASON_STANDINGS(leagueName, seasonNumber);

  return JSON.stringify(standings);
});
