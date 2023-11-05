"use client";

import { useEffect, useState } from "react";
import { useFullLeagueStandings } from "@/context/FullLeagueStandingsContext";
import TeamLogo from "../../server/standings/TeamLogo";

function GameResultScore({ recentGameResult }) {
  console.log(recentGameResult);
  const [gameData, setGameData] = useState(recentGameResult);
  const { clientRecentlyPlayedGames, refreshTheStandings } =
    useFullLeagueStandings();

  useEffect(() => {
    if (refreshTheStandings) {
      setGameData(
        clientRecentlyPlayedGames[clientRecentlyPlayedGames.length - 1]
      );
    }
  }, [clientRecentlyPlayedGames]);

  if (
    gameData !== undefined &&
    gameData !== null &&
    Object.keys(gameData).length !== 0
  ) {
    const homeData = gameData.homeTeamGameStats;
    const awayData = gameData.awayTeamGameStats;
    const otherData = gameData.otherGameStats;
    const boxscoreStats = {
      overtimeRequired: otherData.overtimeRequired,
      wasGameATie: otherData.wasGameATie,
      homeTeam: {
        acronym: otherData.homeTeam,
        homeScore: homeData.HomeGOALS,
      },
      awayTeam: {
        acronym: otherData.awayTeam,
        awayScore: awayData.AwayGOALS,
      },
    };

    const homeAcronym = boxscoreStats["homeTeam"]["acronym"];
    const homeScore = boxscoreStats["homeTeam"]["homeScore"];
    const awayAcronym = boxscoreStats["awayTeam"]["acronym"];
    const awayScore = boxscoreStats["awayTeam"]["awayScore"];
    const wasGameATie = boxscoreStats["wasGameATie"];
    const wasOvertimeRequired = boxscoreStats["overtimeRequired"];
    return (
      <div className=" text-slate-300 border border-slate-300 rounded-md w-3/4 md:w-1/2 m-auto mt-2">
        <div className="flex flex-col">
          {!wasGameATie && wasOvertimeRequired && (
            <div className="text-center text-4xl">OT</div>
          )}
          <div className="w-full flex justify-center gap-3 items-center sm:w-3/4 sm:mx-auto">
            Home
            <TeamLogo name={homeAcronym} width={60} height={60} />
            <div className="text-3xl">
              {homeScore} - {awayScore}
            </div>
            <TeamLogo name={awayAcronym} width={60} height={60} />
            Away
          </div>
        </div>
      </div>
    );
  }
}

export default GameResultScore;
