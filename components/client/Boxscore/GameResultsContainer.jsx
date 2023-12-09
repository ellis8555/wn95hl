"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import GameResults from "./GameResults";

import { FaCircleArrowRight } from "react-icons/fa6";
import { FaCircleArrowLeft } from "react-icons/fa6";

function GameResultsContainer({
  recentGameResults,
  totalGamesSubmitted,
  currentIndex,
  leagueName,
  seasonNumber,
}) {
  const [scoresToDisplay, setScoresToDisplay] = useState(recentGameResults);
  const [league, setLeague] = useState(leagueName);
  const [seasonNum, setSeasonNum] = useState(seasonNumber);
  const [totalGamesPlayed, setTotalGamesPlayed] = useState(totalGamesSubmitted);
  const [displayPreviousGamesArrow, setDisplayPreviousGamesArrow] =
    useState(true);
  const [displayNextGamesArrow, setDisplayNextGamesArrow] = useState(true);

  const indexOfCurrentGamesDisplayed = useRef(currentIndex);

  const router = useRouter();

  async function updateScoresPreviousGames() {
    // hide if less than 8 games submitted
    if (totalGamesPlayed < 8) {
      indexOfCurrentGamesDisplayed.current = 0;
      return;
    }
    if (indexOfCurrentGamesDisplayed.current <= 8) {
      indexOfCurrentGamesDisplayed.current = 0;
    }
    if (indexOfCurrentGamesDisplayed.current > 8) {
      indexOfCurrentGamesDisplayed.current -= 8;
    }
    const url = `/recent-scores/${leagueName}/${seasonNumber}/${indexOfCurrentGamesDisplayed.current}`;
    router.push(url);
  }

  async function updateScoresNextGames() {
    // hide if less than 8 games submitted
    if (totalGamesPlayed < 8) {
      indexOfCurrentGamesDisplayed.current = 0;
      setDisplayNextGamesArrow(false);
      return;
    }
    const diff = totalGamesPlayed - indexOfCurrentGamesDisplayed.current;
    if (diff <= 16) {
      indexOfCurrentGamesDisplayed.current = totalGamesPlayed - 8;
    } else {
      indexOfCurrentGamesDisplayed.current += 8;
    }
    const url = `/recent-scores/${leagueName}/${seasonNumber}/${indexOfCurrentGamesDisplayed.current}`;
    router.push(url);
  }
  return (
    <>
      <div className="flex flex-row justify-center gap-24">
        {displayPreviousGamesArrow && (
          <FaCircleArrowLeft
            onClick={updateScoresPreviousGames}
            className="text-2xl cursor-pointer text-slate-300 hover:text-orange-400"
          />
        )}
        {displayNextGamesArrow && (
          <FaCircleArrowRight
            onClick={updateScoresNextGames}
            className="text-2xl cursor-pointer text-slate-300 hover:text-orange-400"
          />
        )}
      </div>
      <GameResults
        recentGameResults={scoresToDisplay}
        leagueName={league}
        seasonNumber={seasonNum}
      />
    </>
  );
}

export default GameResultsContainer;
