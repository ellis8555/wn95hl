import Standings from "@/components/client/Standings";
import { Suspense } from "react";
import { API_DOMAIN, SORT_STANDINGS } from "@/utils/constants/constants";

async function getStandingsAndLeagueStructure() {
  const response = await fetch(
    `${API_DOMAIN}/api/season-data?league=w&season-number=8&field=standings`,
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

  const leagueAndStructure = await response.json();
  return leagueAndStructure;
}

async function standingsPage() {
  const leagueData = await getStandingsAndLeagueStructure();

  const leagueStructure = leagueData.leagueStructure;
  const standingsArray = leagueData.standings;
  standingsArray.sort((a, b) => SORT_STANDINGS(a, b));
  return (
    <Suspense fallback={<p>Loading table...</p>}>
      <Standings
        leagueName="w"
        seasonNumber="8"
        leagueTable={standingsArray}
        leagueStructure={leagueStructure}
      />
    </Suspense>
  );
}

export default standingsPage;
