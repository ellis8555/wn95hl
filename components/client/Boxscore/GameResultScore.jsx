"use client";

//////////////////////////////////////////////
// Displays recent single game score on mobile
//////////////////////////////////////////////

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthorizationStatus } from "@/context/UserAuthContext";
import { HiMiniCog6Tooth } from "react-icons/hi2";
import { DAYS_OF_WEEK, MONTHS } from "@/utils/constants/constants";
import TeamLogo from "@/components/server/standings/TeamLogo";

function GameResultScore({ recentGameResult, gameDateIndexes, index }) {
  const [gameData] = useState(recentGameResult);
  const [gamesDate, setGamesDate] = useState(null);
  const [gamesDayOfWeek, setGamesDayOfWeek] = useState(null);
  const [gamesMonth, setGamesMonth] = useState(null);
  const [gameDateChanged, setGameDateChanged] = useState(false);
  const [dateOfDifferentDay, setDateOfDifferentDay] = useState(null);
  const [teamLogoWidthHeight, setTeamLogoWidthHeight] = useState(40);
  const { isAuthorized } = useAuthorizationStatus();

  useEffect(() => {
    if (gameDateIndexes.includes(index)) {
      const firstGameTimestamp =
        recentGameResult.otherGameStats.submittedAt || new Date("1970-01-01");
      const firstGameTimestampInTicker = new Date(
        Date.parse(firstGameTimestamp)
      );
      setGamesDate(firstGameTimestampInTicker.getDate());
      setGamesDayOfWeek(DAYS_OF_WEEK[firstGameTimestampInTicker.getDay()]);
      setGamesMonth(MONTHS[firstGameTimestampInTicker.getMonth()]);
      setGameDateChanged(true);
    }
  }, [index, gameDateIndexes]);

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
      <div className=" text-slate-300 pb-2 md:w-3/4 lg:w-1/2 m-auto mt-2">
        {gameDateChanged && (
          <h3 className="text-center text-lg mb-2">
            {gamesDayOfWeek}, {gamesMonth} {gamesDate}
          </h3>
        )}
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
              {awayScore} <span className="text-sm">@</span> {homeScore}
            </div>
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
