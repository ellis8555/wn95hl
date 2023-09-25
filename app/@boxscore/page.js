import Boxscore from "@/components/server/Boxscore/Boxscore";
import { API_DOMAIN } from "@/utils/constants/constants";

async function getRecentGameResults() {
  const response = await fetch(
    `${API_DOMAIN}/api/season-data?league=w&season-number=8&field=recent-results`
  );
  if (!response.ok) {
    const errorMessage = await response.json();
    throw new Error(errorMessage.message);
  }

  const recentGameResults = await response.json();
  return recentGameResults;
}

async function boxscorePage() {
  const recentGameResults = await getRecentGameResults();
  return <Boxscore recentGameResults={recentGameResults} />;
}

export default boxscorePage;
