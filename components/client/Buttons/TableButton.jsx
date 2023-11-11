"use client";
import { useEffect, useState } from "react";
import { useFullLeagueStandings } from "@/context/FullLeagueStandingsContext";

function TableButton({
  children,
  standings,
  setStandings,
  divisions,
  setIsTableFiltered,
  setSplitTables,
  setConference,
  conferenceNames,
}) {
  const [leagueStandings, setLeagueStandings] = useState(standings);
  const [clarenceCampbell, setClarenceCampbell] = useState(
    leagueStandings.filter((team) => {
      if (divisions[team.teamAcronym].conference == "Clarence Campbell") {
        return team;
      }
      return;
    })
  );
  const [princeOfWales, setPrinceOfWales] = useState(
    leagueStandings.filter((team) => {
      if (divisions[team.teamAcronym].conference == "Prince of Wales") {
        return team;
      }
      return;
    })
  );
  const { clientSideStandings, refreshTheStandings } = useFullLeagueStandings();

  useEffect(() => {
    if (refreshTheStandings) {
      setLeagueStandings(clientSideStandings);
    }
  }, [clientSideStandings]);

  useEffect(() => {
    if (refreshTheStandings) {
      setClarenceCampbell(
        leagueStandings.filter((team) => {
          if (divisions[team.teamAcronym].conference == "Clarence Campbell") {
            return team;
          }
          return;
        })
      );
      setPrinceOfWales(
        leagueStandings.filter((team) => {
          if (divisions[team.teamAcronym].conference == "Prince of Wales") {
            return team;
          }
          return;
        })
      );
    }
  }, [leagueStandings]);

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
