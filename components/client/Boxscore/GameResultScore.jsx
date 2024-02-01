"use client";

//////////////////////////////////////////////
// Displays recent single game score on mobile
//////////////////////////////////////////////

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthorizationStatus } from "@/context/UserAuthContext";
import { HiMiniCog6Tooth } from "react-icons/hi2";
import { DAYS_OF_WEEK, MONTHS } from "@/utils/constants/constants";
import TeamLogo from "@/components/server/Logos/TeamLogo";
import BoxscoreButton from "@/components/server/Boxscore/BoxscoreButton";

function GameResultScore({
  recentGameResult,
  gameDateIndexes,
  leagueName,
  seasonNumber,
  index,
}) {
  // game related data
  const [gameId, setGameId] = useState(recentGameResult._id);
  const [wasGameATie, setWasGameATie] = useState(
    recentGameResult.otherGameStats.wasGameATie
  );
  const [wasOvertimeRequired, setWasOvertimeRequired] = useState(
    recentGameResult.otherGameStats.overtimeRequired
  );

  // teams related data

  const [homeAcronym, sethomeAcronym] = useState(
    recentGameResult.otherGameStats.homeTeam
  );
  const [homeScore, setHomeScore] = useState(
    recentGameResult.otherGameStats.homeGoals
  );
  const [awayAcronym, setAwayAcronym] = useState(
    recentGameResult.otherGameStats.awayTeam
  );
  const [awayScore, setAwayScore] = useState(
    recentGameResult.otherGameStats.awayGoals
  );

  // date related information
  const [gamesDate, setGamesDate] = useState(null);
  const [gamesDayOfWeek, setGamesDayOfWeek] = useState(null);
  const [gamesMonth, setGamesMonth] = useState(null);
  const [gameDateChanged, setGameDateChanged] = useState(false);

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

  return (
    <div className=" text-slate-300 pb-2 md:w-3/4 lg:w-1/2 mx-auto mt-2">
      {gameDateChanged && (
        <h3 className="text-center text-xl text-blue-400 mb-2 bg-slate-800">
          {gamesDayOfWeek}, {gamesMonth} {gamesDate}
        </h3>
      )}
      <div className="flex flex-col ">
        {!wasGameATie && wasOvertimeRequired && (
          <div className="text-center text-xl text-orange-400">OT</div>
        )}
        <div className="w-full flex justify-center gap-2 items-center sm:w-3/4 sm:mx-auto sm:gap-6">
          <TeamLogo
            name={awayAcronym}
            width={teamLogoWidthHeight}
            height={teamLogoWidthHeight}
            leagueName={leagueName}
            seasonNumber={seasonNumber}
          />
          {/* <div className="text-xl md:text-2xl"> */}
          <div
            className={
              !wasGameATie && wasOvertimeRequired
                ? "text-xl md:text-2xl text-orange-400"
                : "text-xl md:text-2xl"
            }
          >
            {awayScore} <span className="text-sm">@</span> {homeScore}
          </div>
          <TeamLogo
            name={homeAcronym}
            width={teamLogoWidthHeight}
            height={teamLogoWidthHeight}
            leagueName={leagueName}
            seasonNumber={seasonNumber}
          />
          <div className="bg-green-600 text-xs p-[.1rem] text-white rounded">
            <BoxscoreButton
              leagueName={leagueName}
              seasonNumber={seasonNumber}
              gameId={gameId}
            />
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

export default GameResultScore;
