"use client";

import { useRef, useState } from "react";

import GameResults from "./GameResults";
import { FaCircleArrowRight } from "react-icons/fa6";
import { FaCircleArrowLeft } from "react-icons/fa6";

import { GET_API_WITH_PARAMS } from "@/utils/constants/data-calls/api_calls";
import { HOW_MANY_GAME_RESULTS } from "@/utils/constants/constants";

function GameResultsContainer({
  recentGameResults,
  totalGamesSubmitted,
  leagueName,
  seasonNumber,
}) {
  const [scoresToDisplay, setScoresToDisplay] = useState(recentGameResults);
  const [league, setLeague] = useState(leagueName);
  const [seasonNum, setSeasonNum] = useState(seasonNumber);
  const [totalGamesPlayed, setTotalGamesPlayed] = useState(totalGamesSubmitted);

  const indexOfCurrentGamesDisplayed = useRef(totalGamesPlayed - 8);

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
    const paramsList = `league=${leagueName}&season-number=${seasonNumber}&beginning-index=${indexOfCurrentGamesDisplayed.current}&how-many-games=${HOW_MANY_GAME_RESULTS}`;
    const games = await GET_API_WITH_PARAMS("recent-games", paramsList);
    setScoresToDisplay(games);
  }

  async function updateScoresNextGames() {
    // hide if less than 8 games submitted
    if (totalGamesPlayed < 8) {
      indexOfCurrentGamesDisplayed.current = 0;
      return;
    }
    const diff = totalGamesPlayed - indexOfCurrentGamesDisplayed.current;
    if (diff <= 15) {
      indexOfCurrentGamesDisplayed.current = totalGamesPlayed - 8;
    } else {
      indexOfCurrentGamesDisplayed.current += 8;
    }
    const paramsList = `league=${leagueName}&season-number=${seasonNumber}&beginning-index=${indexOfCurrentGamesDisplayed.current}&how-many-games=${HOW_MANY_GAME_RESULTS}`;
    const games = await GET_API_WITH_PARAMS("recent-games", paramsList);
    setScoresToDisplay(games);
  }

  return (
    <>
      <div className="flex flex-row justify-center gap-24">
        <FaCircleArrowLeft
          onClick={updateScoresPreviousGames}
          className="text-2xl cursor-pointer text-slate-300 hover:text-red-500"
        />
        <FaCircleArrowRight
          onClick={updateScoresNextGames}
          className="text-2xl cursor-pointer text-slate-300 hover:text-red-500"
        />
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
