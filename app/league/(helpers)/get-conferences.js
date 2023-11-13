import { cache } from "react";
import { READ_SEASON_CONFERENCES } from "@/utils/constants/data-calls/db_calls";

export const revalidate = 0;

export const getConferences = cache(async function (leagueName, seasonNumber) {
  const conferences = await READ_SEASON_CONFERENCES(leagueName, seasonNumber);

  return JSON.stringify(conferences);
});
