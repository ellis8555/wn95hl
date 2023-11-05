"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useFullLeagueStandings } from "@/context/FullLeagueStandingsContext";
import { useAuthorizationStatus } from "@/context/UserAuthContext";
import { HiMiniCog6Tooth } from "react-icons/hi2";
import TeamLogo from "@/components/server/standings/TeamLogo";

function GameResultScore({ recentGameResult }) {
  const [gameData, setGameData] = useState(recentGameResult);
  const [teamLogoWidthHeight, setTeamLogoWidthHeight] = useState(40);
  const { clientRecentlyPlayedGames, refreshTheStandings } =
    useFullLeagueStandings();
  const { isAuthorized } = useAuthorizationStatus();

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
      <div className=" text-slate-300 pb-2 md:w-1/2 m-auto mt-2">
        <div className="flex flex-col">
          {!wasGameATie && wasOvertimeRequired && (
            <div className="text-center text-4xl">OT</div>
          )}
          <div className="w-full flex justify-center gap-2 items-center sm:w-3/4 sm:mx-auto sm:gap-6">
            <TeamLogo
              name={awayAcronym}
              width={teamLogoWidthHeight}
              height={teamLogoWidthHeight}
            />
            <div className="text-xl md:text-2xl">
              {awayScore} - {homeScore}
            </div>
            <span className="text-orange-400">@</span>
            <TeamLogo
              name={homeAcronym}
              width={teamLogoWidthHeight}
              height={teamLogoWidthHeight}
            />
            <div className="bg-green-600 text-xs ml-2 p-1 text-white rounded">
              <Link href="/boxscore">Boxscore</Link>
            </div>
            {isAuthorized && (
              <Link href="/edit-boxscore">
                <HiMiniCog6Tooth />
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default GameResultScore;
