"use client";
import { useEffect, useRef, useState } from "react";
import { useFullLeagueStandings } from "@/context/FullLeagueStandingsContext";

function TableButton({
  children,
  standings,
  setStandings,
  divisions,
  setIsTableFiltered,
  setSplitTables,
  setConference,
  conferenceDetails,
}) {
  const [leagueStandings, setLeagueStandings] = useState(standings);

  const firstConferenceDetails = useRef(null);
  const firstConferenceStandings = useRef(null);
  const secondConferenceDetails = useRef(null);
  const secondConferenceStandings = useRef(null);

  const [howManyConferences] = useState(conferenceDetails.length);

  const { clientSideStandings, refreshTheStandings, setIsTableFilteredContext, setDivisionsContext, setConferenceNameContext } = useFullLeagueStandings();

  useEffect(() => {
    if (howManyConferences > 1) {
      switch (howManyConferences) {
        case 2:
          firstConferenceDetails.current = conferenceDetails[0];
          firstConferenceStandings.current = leagueStandings.filter((team) => {
            if (
              divisions[team.teamAcronym].conference ==
              firstConferenceDetails.current.name
            ) {
              return team;
            }
            return;
          });
          secondConferenceDetails.current = conferenceDetails[1];
          secondConferenceStandings.current = leagueStandings.filter((team) => {
            if (
              divisions[team.teamAcronym].conference ==
              secondConferenceDetails.current.name
            ) {
              return team;
            }
            return;
          });
          break;
        default:
          return;
      }
    }
  }, [leagueStandings]);

  useEffect(() => {
    if (refreshTheStandings) {
      setLeagueStandings(clientSideStandings);
    }
  }, [clientSideStandings]);

  useEffect(() => {
    if (refreshTheStandings && howManyConferences > 1) {
      firstConferenceStandings.current = leagueStandings.filter((team) => {
        if (
          divisions[team.teamAcronym].conference ==
          firstConferenceDetails.current.name
        ) {
          return team;
        }
        return;
      });
      secondConferenceStandings.current = leagueStandings.filter((team) => {
        if (
          divisions[team.teamAcronym].conference ==
          secondConferenceDetails.current.name
        ) {
          return team;
        }
        return;
      });
    }
  }, [leagueStandings]);

  return (
    <button
      className="bg-slate-800 text-slate-300 rounded p-1"
      onClick={() => {
        switch (children) {
          case firstConferenceDetails.current.name:
            setIsTableFiltered(true);
            setIsTableFilteredContext(true)
            setDivisionsContext(divisions)
            setConferenceNameContext(firstConferenceDetails.current.name)
            setSplitTables(false);
            setConference(children);
            setStandings(firstConferenceStandings.current);
            break;
          case secondConferenceDetails.current.name:
            setIsTableFiltered(true);
            setIsTableFilteredContext(true)
            setDivisionsContext(divisions)
            setConferenceNameContext(secondConferenceDetails.current.name)
            setSplitTables(false);
            setConference(children);
            setStandings(secondConferenceStandings.current);
            break;
          case "Conferences":
            setIsTableFiltered(true);
            setIsTableFilteredContext(false)
            setDivisionsContext({})
            setConferenceNameContext("")
            setSplitTables(true);
            break;
            default:
              setIsTableFiltered(false);
              setIsTableFilteredContext(false)
              setDivisionsContext({})
              setConferenceNameContext("")
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
