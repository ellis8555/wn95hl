import Standings from "@/components/client/Standings";
import { Suspense } from "react";
import {
  DEFAULT_LEAGUE,
  MOST_RECENT_SEASON,
} from "@/utils/constants/constants";
import { DOMAIN } from "@/utils/constants/connections";

async function getStandings() {
  const url = `${DOMAIN}/api/league-data/${DEFAULT_LEAGUE}/${MOST_RECENT_SEASON}/teams-conferences-and-divisions`;
  const response = await fetch(url, {
    next: {
      revalidate: 0,
    },
  });
  if (!response.ok) {
    const errorMessage = await response.json();
    throw new Error(errorMessage.message);
  }

  const responseData = await response.json();

  return responseData;
}

async function standingsPage() {
  const leagueData = await getStandings();
  const { standings, divisionsAndConferences } = leagueData;

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
