"use client";
import { useState } from "react";

function TableButton({
  children,
  standings,
  setStandings,
  divisions,
  setIsTableFiltered,
  setSplitTables,
  setConference,
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
            setSplitTables(false);
            setConference(children);
            setStandings(clarenceCampbell);
            break;
          case "Prince of Wales":
            setIsTableFiltered(true);
            setSplitTables(false);
            setConference(children);
            setStandings(princeOfWales);
            break;
          case "Conferences":
            setIsTableFiltered(true);
            setSplitTables(true);
            break;
          default:
            setIsTableFiltered(false);
            setSplitTables(false);
            setConference("League");
            setStandings(leagueStandings);
        }
      }}
    >
      {children}
    </button>
  );
}

export default TableButton;
