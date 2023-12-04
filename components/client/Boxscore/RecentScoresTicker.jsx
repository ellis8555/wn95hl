"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useFullLeagueStandings } from "@/context/FullLeagueStandingsContext";
import {
  GET_API_WITH_PARAMS,
  GET_LEAGUE_DATA,
} from "@/utils/constants/data-calls/api_calls";
import {
  DEFAULT_LEAGUE,
  MOST_RECENT_SEASON,
} from "@/utils/constants/constants";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { FaCircleArrowRight } from "react-icons/fa6";
import Ticker from "@/components/server/Boxscore/Ticker";

const HOW_MANY_GAME_RESULTS = 8;

function RecentScoresTicker({ recentGameResults, leagueName, seasonNumber }) {
  // used to update the ticker scores on user selecting various leagues
  const path = usePathname();
  const params = useSearchParams();

  const [recentGamesPlayed, setRecentGamesPlayed] = useState(recentGameResults);
  const [totalGamesPlayed, setTotalGamesPlayed] = useState();
  const indexOfCurrentGamesDisplayed = useRef();
  const [displayPreviousGamesArrow, setDisplayPreviousGamesArrow] =
    useState(true);
  const [displayNextGamesArrow, setDisplayNextGamesArrow] = useState(false);
  const gamesDate = useRef();
  const gamesDay = useRef();
  const [gameDates, setGameDates] = useState([]);

  const { clientRecentlyPlayedGames, refreshTheStandings } =
    useFullLeagueStandings();

  // detect league change to display correct leagues ticker scores
  useEffect(() => {
    (async () => {
      if (path != "/") {
        // leagues linked page uses paths
        // split the url
        const urlParts = path.split("/");
        // the last segment contains the league name
        const leagueName = urlParts[urlParts.length - 1];
        // fetch that leagues most recent games
        const { recentlyPlayedGames, totalGamesSubmitted } =
          await GET_LEAGUE_DATA(
            leagueName,
            MOST_RECENT_SEASON,
            "recent-results"
          );
        setTotalGamesPlayed(totalGamesSubmitted);
        indexOfCurrentGamesDisplayed.current = totalGamesSubmitted - 8;
        if (indexOfCurrentGamesDisplayed.current < 0) {
          indexOfCurrentGamesDisplayed.current = 0;
        }
        if (totalGamesPlayed <= 8) {
          setDisplayPreviousGamesArrow(false);
          setDisplayNextGamesArrow(false);
        } else {
          setDisplayPreviousGamesArrow(true);
          setDisplayNextGamesArrow(false);
        }
        setRecentGamesPlayed(recentlyPlayedGames);
        return;
      }
      // if recent score ticker is requested to change from home page
      if (path == "/" && params.has("league")) {
        // get the leagues name
        const leagueName = params.get("league");
        // fetch that leagues most recent games
        const { recentlyPlayedGames, totalGamesSubmitted } =
          await GET_LEAGUE_DATA(
            leagueName,
            MOST_RECENT_SEASON,
            "recent-results"
          );
        setTotalGamesPlayed(totalGamesSubmitted);
        indexOfCurrentGamesDisplayed.current = totalGamesSubmitted - 8;
        if (indexOfCurrentGamesDisplayed.current < 0) {
          indexOfCurrentGamesDisplayed.current = 0;
        }
        if (totalGamesPlayed <= 8) {
          setDisplayPreviousGamesArrow(false);
          setDisplayNextGamesArrow(false);
        } else {
          setDisplayPreviousGamesArrow(true);
          setDisplayNextGamesArrow(false);
        }
        setRecentGamesPlayed(recentlyPlayedGames);
        return;
      } else {
        // display on original home page landing
        const { recentlyPlayedGames, totalGamesSubmitted } =
          await GET_LEAGUE_DATA(
            DEFAULT_LEAGUE,
            MOST_RECENT_SEASON,
            "recent-results"
          );
        setTotalGamesPlayed(totalGamesSubmitted);
        indexOfCurrentGamesDisplayed.current = totalGamesSubmitted - 8;
        if (indexOfCurrentGamesDisplayed.current < 0) {
          indexOfCurrentGamesDisplayed.current = 0;
        }
        if (totalGamesPlayed <= 8) {
          setDisplayPreviousGamesArrow(false);
          setDisplayNextGamesArrow(false);
        } else {
          setDisplayPreviousGamesArrow(true);
          setDisplayNextGamesArrow(false);
        }
        setRecentGamesPlayed(recentlyPlayedGames);
        return;
      }
    })();
  }, [refreshTheStandings]);

  // update ticker when a new game file is uploaded
  useEffect(() => {
    if (refreshTheStandings) {
      setRecentGamesPlayed(clientRecentlyPlayedGames);
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
      indexOfCurrentGamesDisplayed.current = 0;
      setDisplayPreviousGamesArrow(false);
      return;
    }
    if (indexOfCurrentGamesDisplayed.current <= 8) {
      indexOfCurrentGamesDisplayed.current = 0;

      setDisplayPreviousGamesArrow(false);
      setDisplayNextGamesArrow(true);
    }
    if (indexOfCurrentGamesDisplayed.current > 8) {
      indexOfCurrentGamesDisplayed.current -= 8;
      setDisplayPreviousGamesArrow(true);
      setDisplayNextGamesArrow(true);
    }
    const paramsList = `league=${leagueName}&season-number=${seasonNumber}&beginning-index=${indexOfCurrentGamesDisplayed.current}&how-many-games=${HOW_MANY_GAME_RESULTS}`;
    const games = await GET_API_WITH_PARAMS("recent-games", paramsList);
    setRecentGamesPlayed(games);
  }

  // handle next games button
  async function updateTickerNextGames() {
    // hide if less than 8 games submitted
    if (totalGamesPlayed < 8) {
      indexOfCurrentGamesDisplayed.current = 0;
      setDisplayNextGamesArrow(false);
      return;
    }
    const diff = totalGamesPlayed - indexOfCurrentGamesDisplayed.current;
    if (diff <= 15) {
      indexOfCurrentGamesDisplayed.current = totalGamesPlayed - 8;

      setDisplayNextGamesArrow(false);
      if (indexOfCurrentGamesDisplayed.current > 7) {
        setDisplayPreviousGamesArrow(true);
      }
    } else {
      indexOfCurrentGamesDisplayed.current += 8;
      setDisplayNextGamesArrow(true);
      if (indexOfCurrentGamesDisplayed.current > 7) {
        setDisplayPreviousGamesArrow(true);
      }
    }
    const paramsList = `league=${leagueName}&season-number=${seasonNumber}&beginning-index=${indexOfCurrentGamesDisplayed.current}&how-many-games=${HOW_MANY_GAME_RESULTS}`;
    const games = await GET_API_WITH_PARAMS("recent-games", paramsList);
    setRecentGamesPlayed(games);
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
