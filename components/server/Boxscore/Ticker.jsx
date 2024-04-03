import TeamLogo from "../Logos/TeamLogo";
import { MONTHS, DAYS_OF_WEEK } from "@/utils/constants/constants";
import BoxscoreButton from "./BoxscoreButton";

function Ticker({
  gameData,
  index,
  gameDateIndexes,
  leagueName,
  seasonNumber,
}) {
  if (
    gameData !== undefined &&
    gameData !== null &&
    Object.keys(gameData).length !== 0
  ) {
    const gameId = gameData._id;
    const otherData = gameData.otherGameStats;
    const boxscoreStats = {
      overtimeRequired: otherData.overtimeRequired,
      wasGameATie: otherData.wasGameATie,
      homeTeam: {
        acronym: otherData.homeTeam,
        homeScore: otherData.homeGoals,
      },
      awayTeam: {
        acronym: otherData.awayTeam,
        awayScore: otherData.awayGoals,
      },
    };
    const homeAcronym = boxscoreStats["homeTeam"]["acronym"];
    const homeScore = boxscoreStats["homeTeam"]["homeScore"];
    const awayAcronym = boxscoreStats["awayTeam"]["acronym"];
    const awayScore = boxscoreStats["awayTeam"]["awayScore"];
    const wasGameATie = boxscoreStats["wasGameATie"];
    const wasOvertimeRequired = boxscoreStats["overtimeRequired"];

    let isNewGameDate = false;
    let month;
    let dayOfWeek;
    let date;
    let isToday = false;
    if (gameDateIndexes.includes(index)) {
      isNewGameDate = true;
      const getGameTimestamp =
        Date.parse(gameData.otherGameStats.submittedAt) ||
        new Date("1970-01-01");
        // time of games upload
      const dateOfGame = new Date(getGameTimestamp);
      month = MONTHS[dateOfGame.getMonth()];
      date = dateOfGame.getDate();
      dayOfWeek = DAYS_OF_WEEK[dateOfGame.getDay()];
      // get current timestamp to see if game is yesterday or today
      const today = new Date();
      const todaysMonth = MONTHS[today.getMonth()]
      const todaysDate = today.getDate()
      if(month == todaysMonth && date == todaysDate){
        isToday = true
      }
    }
    return (
      <>
        {/* inside ticker container */}
        {/* set date if date is different from previous game state */}
        {isNewGameDate && (
          <div className="flex border border-black bg-slate-800 items-center p-1">
            <div className="flex flex-col items-center justify-center">
              {isToday ? (
                <div className="flex flex-col w-6">
                  {"Today".split("").map((letter, index) => (
                    <div
                      key={index}
                      className="font-semibold text-xs text-center"
                    >
                      {letter}
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="font-medium">{dayOfWeek}</div>
                  <div className="font-small">{month}</div>
                  <div className="font-small">{date}</div>
                </>
              )}
            </div>
          </div>
        )}
        <div className="flex flex-col border border-black">
          <div className="flex flex-row w-28 p-1">
            {/* actual score tickers container */}
            <div className="flex items-center">
              <div className="flex flex-col items-center">
                {/* away team */}
                <div className="flex flex-row gap-4 items-center ">
                  <div>
                    <TeamLogo
                      name={awayAcronym}
                      width={30}
                      height={30}
                      leagueName={leagueName}
                      seasonNumber={seasonNumber}
                    />
                  </div>
                  <div>
                    <div>{awayScore}</div>
                  </div>
                </div>
                {/* home team */}
                <div className="flex flex-row gap-4 items-center ">
                  <div>
                    <TeamLogo
                      name={homeAcronym}
                      width={30}
                      height={30}
                      leagueName={leagueName}
                      seasonNumber={seasonNumber}
                    />
                  </div>
                  <div>
                    <div>{homeScore}</div>
                  </div>
                </div>
              </div>
            </div>
            {!wasGameATie && wasOvertimeRequired ? (
              <div className="flex flex-col justify-center mx-auto">OT</div>
            ) : (
              ""
            )}
          </div>
          <div className="bg-green-600 text-xs p-[.1rem] text-white rounded w-fit m-auto mb-0">
            <BoxscoreButton
              leagueName={leagueName}
              seasonNumber={seasonNumber}
              gameId={gameId}
            />
          </div>
        </div>
      </>
    );
  }
}

export default Ticker;
