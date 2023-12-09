"use client";

import React, { useEffect, useRef, useState } from "react";
import { useFullLeagueStandings } from "@/context/FullLeagueStandingsContext";
import {
  GET_API_WITH_PARAMS,
  GET_LEAGUE_DATA,
} from "@/utils/constants/data-calls/api_calls";
import {
  MOST_RECENT_SEASON,
  HOW_MANY_GAME_RESULTS,
} from "@/utils/constants/constants";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { FaCircleArrowRight } from "react-icons/fa6";
import Ticker from "@/components/server/Boxscore/Ticker";

function RecentScoresTicker({ recentGameResults, leagueName, seasonNumber }) {
  const [recentGamesPlayed, setRecentGamesPlayed] = useState(recentGameResults);
  const [totalGamesPlayed, setTotalGamesPlayed] = useState();
  const indexOfCurrentGamesDisplayedLAYOUT = useRef();
  const [displayPreviousGamesArrow, setDisplayPreviousGamesArrow] =
    useState(true);
  const [displayNextGamesArrow, setDisplayNextGamesArrow] = useState(false);
  const gamesDate = useRef();
  const gamesDay = useRef();
  const [gameDates, setGameDates] = useState([]);

  const {
    clientRecentlyPlayedGames,
    refreshTheStandings,
    setRefreshTheStandings,
    league,
  } = useFullLeagueStandings();

  // detect league change to display correct leagues ticker scores
  useEffect(() => {
    (async () => {
      // display on original home page landing
      const { recentlyPlayedGames, totalGamesSubmitted } =
        await GET_LEAGUE_DATA(league, MOST_RECENT_SEASON, "recent-results");
      setTotalGamesPlayed(totalGamesSubmitted);
      indexOfCurrentGamesDisplayedLAYOUT.current = totalGamesSubmitted - 8;
      if (indexOfCurrentGamesDisplayedLAYOUT.current < 0) {
        indexOfCurrentGamesDisplayedLAYOUT.current = 0;
      }
      if (totalGamesPlayed <= 8) {
        setDisplayPreviousGamesArrow(false);
        setDisplayNextGamesArrow(false);
      } else {
        setDisplayPreviousGamesArrow(true);
        setDisplayNextGamesArrow(false);
      }
      setRecentGamesPlayed(recentlyPlayedGames);
    })();
  }, [refreshTheStandings]);

  // update ticker when a new game file is uploaded
  useEffect(() => {
    if (refreshTheStandings) {
      setRecentGamesPlayed(clientRecentlyPlayedGames);
      setRefreshTheStandings(false);
    }
  }, [clientRecentlyPlayedGames]);

  // displays dates for games submitted on different dates
  useEffect(() => {
    const gameDatesArray = [0];

    if (recentGamesPlayed.length > 0) {
      const firstGameTimestamp =
        recentGamesPlayed[0].otherGameStats.submittedAt ||
        new Date("2022-09-17");
      const firstGameTimestampInTicker = Date.parse(firstGameTimestamp);
      gamesDate.current = new Date(firstGameTimestampInTicker);
      gamesDay.current = gamesDate.current.getDate();
      recentGamesPlayed.forEach((game, index) => {
        const gameTimestampTicker = Date.parse(
          game.otherGameStats.submittedAt || new Date("1970-01-01")
        );
        const thisGamesDate = new Date(gameTimestampTicker);
        const thisGamesDay = thisGamesDate.getDate();

        if (thisGamesDay != gamesDay.current) {
          gameDatesArray.push(index);
          gamesDay.current = thisGamesDay;
        }
      });
      setGameDates(gameDatesArray);
    }
  }, [recentGamesPlayed]);

  // handle previous games button
  async function updateTickerPreviousGames() {
    // hide if less than 8 games submitted
    if (totalGamesPlayed < 8) {
      indexOfCurrentGamesDisplayedLAYOUT.current = 0;
      setDisplayPreviousGamesArrow(false);
      return;
    }
    if (indexOfCurrentGamesDisplayedLAYOUT.current <= 8) {
      indexOfCurrentGamesDisplayedLAYOUT.current = 0;
      setDisplayPreviousGamesArrow(false);
      setDisplayNextGamesArrow(true);
    }
    if (indexOfCurrentGamesDisplayedLAYOUT.current > 8) {
      indexOfCurrentGamesDisplayedLAYOUT.current -= 8;
      setDisplayPreviousGamesArrow(true);
      setDisplayNextGamesArrow(true);
    }
    const paramsList = `league=${leagueName}&season-number=${seasonNumber}&beginning-index=${indexOfCurrentGamesDisplayedLAYOUT.current}&how-many-games=${HOW_MANY_GAME_RESULTS}`;
    const { selectedGames } = await GET_API_WITH_PARAMS(
      "recent-games",
      paramsList
    );
    setRecentGamesPlayed(selectedGames);
  }

  // handle next games button
  async function updateTickerNextGames() {
    // hide if less than 8 games submitted
    if (totalGamesPlayed < 8) {
      indexOfCurrentGamesDisplayedLAYOUT.current = 0;
      setDisplayNextGamesArrow(false);
      return;
    }
    const diff = totalGamesPlayed - indexOfCurrentGamesDisplayedLAYOUT.current;
    if (diff <= 16) {
      indexOfCurrentGamesDisplayedLAYOUT.current = totalGamesPlayed - 8;
      setDisplayNextGamesArrow(false);
      if (indexOfCurrentGamesDisplayedLAYOUT.current > 7) {
        setDisplayPreviousGamesArrow(true);
      }
    } else {
      indexOfCurrentGamesDisplayedLAYOUT.current += 8;
      setDisplayNextGamesArrow(true);
      if (indexOfCurrentGamesDisplayedLAYOUT.current > 7) {
        setDisplayPreviousGamesArrow(true);
      }
    }
    const paramsList = `league=${leagueName}&season-number=${seasonNumber}&beginning-index=${indexOfCurrentGamesDisplayedLAYOUT.current}&how-many-games=${HOW_MANY_GAME_RESULTS}`;
    const { selectedGames } = await GET_API_WITH_PARAMS(
      "recent-games",
      paramsList
    );
    setRecentGamesPlayed(selectedGames);
  }
  return (
    <>
      {/* entire score ticker container */}
      <div className="hidden lg:flex flex-row justify-center gap-[1px]">
        {displayPreviousGamesArrow && (
          <div className="flex items-center pr-1">
            <FaCircleArrowLeft
              className="text-xl cursor-pointer hover:text-orange-400"
              onClick={updateTickerPreviousGames}
            />
          </div>
        )}
        {recentGamesPlayed.map((game, index) => (
          <Ticker
            gameData={game}
            index={index}
            gameDateIndexes={gameDates}
            leagueName={leagueName}
            seasonNumber={seasonNumber}
            key={index}
          />
        ))}
        {displayNextGamesArrow && (
          <div className="flex items-center pl-1">
            <FaCircleArrowRight
              className="text-xl cursor-pointer hover:text-orange-400"
              onClick={updateTickerNextGames}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default React.memo(RecentScoresTicker);
