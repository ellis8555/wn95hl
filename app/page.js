import Boxscore from "@/components/server/Boxscore/Boxscore";
import GameInputForm from "@/components/client/GameInputForm";
import Standings from "@/components/client/Standings";
import { API_DOMAIN, SORT_STANDINGS } from "@/utils/constants/constants";

export const metadata = {
  title: "NHL95",
  description: "Test site for NHL95",
};

let userMessage;

async function getStandingsAndLeagueStructure() {
  try {
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
      throw new Error(errorMessage);
    }

    const leagueAndStructure = await response.json();
    return leagueAndStructure;
  } catch (error) {
    userMessage = error.errorMessage;
  }
}

async function getRecentGameResults() {
  try {
    // message the user request has been sent
    const response = await fetch(
      `${API_DOMAIN}/api/season-data?league=w&season-number=8&field=recent-results`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      const errorMessage = await response.json();
      throw new Error(errorMessage);
    }

    const recentGameResults = await response.json();
    return recentGameResults;
  } catch (error) {
    userMessage = error.errorMessage;
  }
}

export default async function Home() {
  const fetchLeagueData = getStandingsAndLeagueStructure();
  const recentGameResults = getRecentGameResults();

  const [leagueData, recentGames] = await Promise.all([
    fetchLeagueData,
    recentGameResults,
  ]);

  const leagueStructure = leagueData.leagueStructure;
  const standingsArray = leagueData.standings;
  standingsArray.sort((a, b) => SORT_STANDINGS(a, b));

  return (
    <main>
      <h1 className="text-3xl text-center">nhl95.net affiliated test area</h1>
      <Boxscore recentGameResults={recentGames} />
      {/* <GameInputForm leagueName="w" seasonNumber="8" /> */}
      <Standings
        leagueName="w"
        seasonNumber="8"
        leagueTable={standingsArray}
        leagueStructure={leagueStructure}
      />
      {userMessage && <p>{userMessage}</p>}
    </main>
  );
}
