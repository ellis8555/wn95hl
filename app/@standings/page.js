import Standings from "@/components/client/Standings";
import { Suspense } from "react";
import {
  DEFAULT_LEAGUE,
  SORT_STANDINGS,
  MOST_RECENT_SEASON,
} from "@/utils/constants/constants";
import { DOMAIN } from "@/utils/constants/connections";

async function getStandings() {
  const response = await fetch(
    `${DOMAIN}/api/season-data?league=w&season-number=8&field=standings`,
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

  const responseData = await response.json();

  return responseData;
}
async function getDivisionsAndConferences() {
  const response = await fetch(
    `${DOMAIN}/api/season-data?league=w&season-number=8&field=teams-conferences-and-divisions`,
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

  const responseData = await response.json();
  return responseData;
}

async function standingsPage() {
  const [standings, divisionsAndConferences] = await Promise.all([
    getStandings(),
    getDivisionsAndConferences(),
  ]);
  standings.sort((a, b) => SORT_STANDINGS(a, b));
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
