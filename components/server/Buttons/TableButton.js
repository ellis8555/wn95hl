"use client";
import { useState } from "react";

function TableButton({
  children,
  standings,
  setStandings,
  divisions,
  setIsTableFiltered,
}) {
  const [leagueStandings] = useState(standings);
  const [clarenceCampbell] = useState(
    leagueStandings.filter((team) => {
      if (divisions[team.teamAcronym].conference == "Clarence Campbell") {
        return team;
      }
      return;
    })
  );
  const [princeOfWales] = useState(
    leagueStandings.filter((team) => {
      if (divisions[team.teamAcronym].conference == "Prince of Wales") {
        return team;
      }
      return;
    })
  );

  return (
    <button
      className="bg-slate-300 rounded p-1"
      onClick={() => {
        switch (children) {
          case "Clarence Campbell":
            setIsTableFiltered(true);
            setStandings(clarenceCampbell);
            break;
          case "Prince of Wales":
            setIsTableFiltered(true);
            setStandings(princeOfWales);
            break;
          default:
            setIsTableFiltered(false);
            setStandings(leagueStandings);
        }
      }}
    >
      {children}
    </button>
  );
}

export default TableButton;
