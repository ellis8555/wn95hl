import Standings from "@/components/client/Standings";
import { Suspense } from "react";
import {
  DEFAULT_LEAGUE,
  LEAGUE_SCHEMA_SWITCH,
  MOST_RECENT_SEASON,
} from "@/utils/constants/constants";
import { connectToDb } from "@/utils/database";
import W_Season from "@/schemas/season/w_season";

export const dynamic = "force-dynamic";

async function getStandings(seasonNumber) {
  await connectToDb();

  const responseData = {};

  const League = LEAGUE_SCHEMA_SWITCH(DEFAULT_LEAGUE, W_Season);

  const doesSeasonExist = await League.queryForIfSeasonExists(seasonNumber);
  if (!doesSeasonExist) {
    throw new Error(`Season ${seasonNumber} does not exist`);
  }

  responseData.standings = await League.getSortedStandings(seasonNumber);
  await League.getFieldData(
    seasonNumber,
    "teams-conferences-and-divisions",
    responseData
  );

  return JSON.stringify(responseData);
}

async function standingsPage() {
  const { standings, divisionsAndConferences } = JSON.parse(
    await getStandings(MOST_RECENT_SEASON)
  );

  return (
    <Suspense fallback={<p>Loading table...</p>}>
      <Standings
        leagueName={DEFAULT_LEAGUE}
        seasonNumber={MOST_RECENT_SEASON}
        leagueTable={standings}
        leagueStructure={divisionsAndConferences}
      />
    </Suspense>
  );
}

export default standingsPage;
