import Standings from "@/components/client/Standings";
import { Suspense } from "react";
import { DEFAULT_LEAGUE, SORT_STANDINGS } from "@/utils/constants/constants";
import { DOMAIN } from "@/utils/constants/connections";

async function getStandings() {
  const response = await fetch(`${DOMAIN}/api/season-data?field=standings`, {
    next: {
      revalidate: 0,
    },
  });

  if (!response.ok) {
    const errorMessage = await response.json();
    throw new Error(errorMessage.message);
  }

  const standings = await response.json();
  return standings;
}

async function getLeagueDivsionsAndStandings() {
  const response = await fetch(
    `${DOMAIN}/api/season-data?field=teamsConferencesAndDivisions`,
    {
      next: {
        revalidate: 0,
      },
    }
  );

  if (!response.ok) {
    const errorMessage = await response.json();
    throw new Error(errorMessage.message);
  }

  const divisionsAndConferences = await response.json();
  return divisionsAndConferences;
}

async function getMostRecentSeason() {
  const response = await fetch(
    `${DOMAIN}/api/season-data?field=most-recent-season`,
    {
      next: {
        revalidate: 0,
      },
    }
  );
  if (!response.ok) {
    const errorMessage = await response.json();
    throw new Error(errorMessage.message);
  }

  const mostRecentSeason = await response.json();
  return mostRecentSeason;
}

async function standingsPage() {
  const mostRecentSeason = await getMostRecentSeason();
  const standings = await getStandings();
  standings.sort((a, b) => SORT_STANDINGS(a, b));
  const divisionsAndConferences = await getLeagueDivsionsAndStandings();

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
