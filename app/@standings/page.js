import Standings from "@/components/client/Standings";
import { Suspense } from "react";
import { SORT_STANDINGS } from "@/utils/constants/constants";
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

async function standingsPage() {
  const standings = await getStandings();
  const divisionsAndConferences = await getLeagueDivsionsAndStandings();

  standings.sort((a, b) => SORT_STANDINGS(a, b));
  return (
    <Suspense fallback={<p>Loading table...</p>}>
      <Standings
        leagueName="w"
        seasonNumber="8"
        leagueTable={standings}
        leagueStructure={divisionsAndConferences}
      />
    </Suspense>
  );
}

export default standingsPage;
