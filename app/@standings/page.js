import Standings from "@/components/client/Standings";
import { Suspense } from "react";
import {
  API_READ_SEASON_DATA,
  DEFAULT_LEAGUE,
  MOST_RECENT_SEASON,
  SORT_STANDINGS,
} from "@/utils/constants/constants";
import { DOMAIN } from "@/utils/constants/connections";

async function standingsPage() {
  const mostRecentSeason = await API_READ_SEASON_DATA(
    DOMAIN,
    DEFAULT_LEAGUE,
    MOST_RECENT_SEASON,
    "most-recent-season"
  );
  const standings = await API_READ_SEASON_DATA(
    DOMAIN,
    DEFAULT_LEAGUE,
    MOST_RECENT_SEASON,
    "standings"
  );
  console.log(standings);
  standings.sort((a, b) => SORT_STANDINGS(a, b));
  const divisionsAndConferences = await API_READ_SEASON_DATA(
    DOMAIN,
    DEFAULT_LEAGUE,
    MOST_RECENT_SEASON,
    "teamsConferencesAndDivisions"
  );
  return (
    <Suspense fallback={<p>Loading table...</p>}>
      <Standings
        leagueName={DEFAULT_LEAGUE}
        seasonNumber={mostRecentSeason}
        leagueTable={standings}
        leagueStructure={divisionsAndConferences}
      />
    </Suspense>
  );
}

export default standingsPage;
