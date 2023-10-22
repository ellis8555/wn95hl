import Standings from "@/components/client/Standings";
import { Suspense } from "react";
import {
  DEFAULT_LEAGUE,
  MOST_RECENT_SEASON,
} from "@/utils/constants/constants";
import {
  READ_SEASON_FIELD_DATA,
  READ_SEASON_STANDINGS,
} from "@/utils/constants/api_consts";

export const dynamic = "force-dynamic";

async function getStandings(leagueName, seasonNumber) {
  const responseData = {};

  responseData.standings = await READ_SEASON_STANDINGS(
    leagueName,
    seasonNumber
  );

  const { divisionsAndConferences } = await READ_SEASON_FIELD_DATA(
    leagueName,
    seasonNumber,
    "teams-conferences-and-divisions"
  );

  responseData.divisionsAndConferences = divisionsAndConferences;

  return JSON.stringify(responseData);
}

async function standingsPage() {
  const { standings, divisionsAndConferences } = JSON.parse(
    await getStandings(DEFAULT_LEAGUE, MOST_RECENT_SEASON)
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
