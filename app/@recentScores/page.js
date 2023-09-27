import Boxscore from "@/components/server/Boxscore/Boxscore";
import GameResultScore from "@/components/server/Boxscore/GameResultScore";
import { Suspense } from "react";
import { DOMAIN } from "@/utils/constants/constants";

async function getRecentGameResults() {
  const response = await fetch(
    `${DOMAIN}/api/season-data?league=w&season-number=8&field=recent-results`,
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

  const recentGameResults = await response.json();
  return recentGameResults;
}

async function recentScores() {
  const recentGameResults = await getRecentGameResults();
  return (
    <>
      <Suspense fallback={<p>Loading recent results...</p>}>
        <Boxscore recentGameResults={recentGameResults} />
      </Suspense>
      <div className="sm:hidden">
        <div className="text-xl text-center my-4">Latest result</div>
        <Suspense fallback={<p>Processing game...</p>}>
          <GameResultScore recentGameResults={recentGameResults} />
        </Suspense>
      </div>
    </>
  );
}

export default recentScores;
