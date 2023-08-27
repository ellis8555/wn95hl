import TeamLogo from "./standings/TeamLogo";

function Boxscore({ boxscore }) {
  if (
    boxscore !== undefined &&
    boxscore !== null &&
    Object.keys(boxscore).length !== 0
  ) {
    const homeAcronym = boxscore["homeTeam"]["acronym"];
    const homeScore = boxscore["homeTeam"]["homeScore"];
    const awayAcronym = boxscore["awayTeam"]["acronym"];
    const awayScore = boxscore["awayTeam"]["awayScore"];
    const wasGameATie = boxscore["wasGameATie"];
    const wasOvertimeRequired = boxscore["overtimeRequired"];
    return (
      <>
        {!wasGameATie && wasOvertimeRequired && (
          <div className="text-center text-4xl">OT</div>
        )}
        <div className="w-full flex justify-center gap-3 items-center sm:w-1/2 sm:mx-auto">
          Home
          <TeamLogo name={homeAcronym} width={60} height={60} />
          <div className="text-4xl">
            {homeScore} - {awayScore}
          </div>
          <TeamLogo name={awayAcronym} width={60} height={60} />
          Away
        </div>
      </>
    );
  }

  return (
    <div className="w-full text-center bg-slate-200 mt-4 sm:w-3/4 sm:mx-auto">
      Submit a game state
    </div>
  );
}

export default Boxscore;
