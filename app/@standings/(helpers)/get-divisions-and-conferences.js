import { cache } from "react";
import { READ_SEASON_FIELD_DATA } from "@/utils/constants/data-calls/db_calls";

export const revalidate = 0;

export const getDivisionsAndConferences = cache(async function (
  leagueName,
  seasonNumber
) {
  const { divisionsAndConferences } = await READ_SEASON_FIELD_DATA(
    leagueName,
    seasonNumber,
    "teams-conferences-and-divisions"
  );
  return JSON.stringify(divisionsAndConferences);
});
