"use client";

///////////////////////////////////
// Displays recent scores on mobile
///////////////////////////////////

import { useEffect, useRef, useState } from "react";
import { useFullLeagueStandings } from "@/context/FullLeagueStandingsContext";
import GameResultScore from "./GameResultScore";

function GameResults({ recentGameResults, leagueName, seasonNumber }) {
  const [recentGamesPlayed, setRecentGamesPlayed] = useState(recentGameResults);
  const gamesDate = useRef();
  const gamesDay = useRef();
  const [gameDates, setGameDates] = useState([]);

  const { refreshTheStandings, clientRecentlyPlayedGames } =
    useFullLeagueStandings();

  // update recent scores when a new game file is uploaded
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

  return (
    <div>
      {recentGamesPlayed.map((game, index) => (
        <GameResultScore
          recentGameResult={game}
          gameDateIndexes={gameDates}
          index={index}
          leagueName={leagueName}
          seasonNumber={seasonNumber}
          key={index}
        />
      ))}
    </div>
  );
}

export default GameResults;
