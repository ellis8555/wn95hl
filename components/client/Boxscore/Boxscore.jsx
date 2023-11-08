"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useFullLeagueStandings } from "@/context/FullLeagueStandingsContext";
import { GET_LEAGUE_DATA } from "@/utils/constants/data-calls/api_calls";
import { MOST_RECENT_SEASON } from "@/utils/constants/constants";
import Ticker from "@/components/server/Boxscore/Ticker";

function Boxscore({ recentGameResults }) {
  // used to update the ticker scores on user selecting various leagues
  const path = usePathname();
  const params = useSearchParams();

  // check if user has selected a league to change score ticker

  const [recentGamesPlayed, setRecentGamesPlayed] = useState(recentGameResults);
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
        const { recentlyPlayedGames } = await GET_LEAGUE_DATA(
          leagueName,
          MOST_RECENT_SEASON,
          "recent-results"
        );
        setRecentGamesPlayed(recentlyPlayedGames);
        return;
      }
      // if recent score ticker is requested to change from home page
      if (path == "/" && params.has("league")) {
        console.log("inside of params scores");
        // get the leagues name
        const leagueName = params.get("league");
        // fetch that leagues most recent games
        const { recentlyPlayedGames } = await GET_LEAGUE_DATA(
          leagueName,
          MOST_RECENT_SEASON,
          "recent-results"
        );
        setRecentGamesPlayed(recentlyPlayedGames);
        return;
      }
    })();
  }, [path, params]);

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
