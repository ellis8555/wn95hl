"use client";

import { useEffect, useRef, useState } from "react";
import { useFullLeagueStandings } from "@/context/FullLeagueStandingsContext";
import Ticker from "@/components/server/Boxscore/Ticker";

function Boxscore({ recentGameResults }) {
  const [recentGamesPlayed, setrecentGamesPlayed] = useState(recentGameResults);
  const gamesDate = useRef();
  const gamesDay = useRef();
  const [gameDates, setGameDates] = useState([]);

  const { clientRecentlyPlayedGames, refreshTheStandings } =
    useFullLeagueStandings();

  useEffect(() => {
    if (refreshTheStandings) {
      setrecentGamesPlayed(clientRecentlyPlayedGames);
    }
  }, [clientRecentlyPlayedGames]);

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
          game.otherGameStats.submittedAt || new Date("2022-09-17")
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
    <>
      {/* entire score ticker container */}
      <div className="hidden sm:flex flex-row justify-center gap-1">
        {recentGamesPlayed.map((game, index) => (
          <Ticker
            gameData={game}
            index={index}
            gameDateIndexes={gameDates}
            key={index}
          />
        ))}
      </div>
    </>
  );
}

export default Boxscore;
