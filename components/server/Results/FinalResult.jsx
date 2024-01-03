function Result({ teamAcronym, game }) {
  let bgColor;
  let result;
  if (game.otherGameStats.losingTeam == teamAcronym) {
    if (game.otherGameStats.overtimeLossTeam == teamAcronym) {
      bgColor = "bg-orange-600";
      result = "OTL";
    } else {
      bgColor = "bg-red-600";
      result = "L";
    }
  } else if (
    game.otherGameStats.homeTeamPoints == 1 &&
    game.otherGameStats.awayTeamPoints == 1
  ) {
    bgColor = "bg-slate-700";
    result = "T";
  } else {
    bgColor = "bg-green-600";
    result = "W";
  }
  return (
    <div
      key={game._id}
      className={`flex justify-center border border-slate-300 p-0 my-4 w-8 ${bgColor}`}
    >
      {result}
    </div>
  );
}

export default Result;
