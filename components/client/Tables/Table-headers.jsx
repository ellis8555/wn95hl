'use client'

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useFullLeagueStandings } from "@/context/FullLeagueStandingsContext";
import { LEAGUE_TABLE_CATEGORIES } from "@/utils/constants/constants";

function TableHeaders({setAreStandingsSorted, setSortedStandings, standings}){

  let currentStandings = useRef(standings)
  // pathName used to change conferenceName/isTableFiltered contexts back to empty when moving away from a filtered path
  const pathName = usePathname()
  // contexts used for sorting between full or filtered standing tables
  const {isTableFilteredContext, setIsTableFilteredContext, divisionsContext, conferenceNameContext, setConferenceNameContext} = useFullLeagueStandings()

  // this allows sorting after switching to a different conference
  useEffect(() => {
      currentStandings.current = standings
    },[conferenceNameContext])

  // when navigating from away from filtered table reset conference name context
  useEffect(() => {
      setIsTableFilteredContext(false);
      setConferenceNameContext("")
    },[pathName])
    
    function readHeader(e){
      // get the name of the columns header
    let header = e.target.textContent

    // if user has clicked on filter by conference or division button
    if(isTableFilteredContext){
        currentStandings.current = currentStandings.current.filter((team) => {
            if (
                divisionsContext[team.teamAcronym].conference ==
              conferenceNameContext
            ) {
              return team;
            }
            return;
          });
    }
    // table displays Team which matches db field of teamName
    if(header === "Team"){
        header = "teamName"
    }

    // custom sort for teams current streak
    if (header === "Strk") {
      const sortedByStrk = [...currentStandings.current].sort((a, b) => {
          const getStreakType = (str) => {
              const extractStreakType = str.charAt(str.length - 1);
              const currentStreak = parseInt(str)
              switch (extractStreakType) {
                  case "W":
                      return 100 + currentStreak;
                  case "L":
                      return 50 - currentStreak;
                  case "T":
                      return 50 + currentStreak;
                  default:
                      return 50;
              }
          };

          return getStreakType(b[header]) - getStreakType(a[header]);
      });

      setSortedStandings(sortedByStrk);
      currentStandings.current = standings
      setAreStandingsSorted(true);
      return;
  }

  const sortedStandings = [...currentStandings.current].sort((a, b) => {
  // teamName is sorting strings
  if (header === "teamName"){
            return a[header].localeCompare(b[header]);
        } else {
          // fields that are numeric
            return b[header] - a[header]
        }
    });
    setSortedStandings(sortedStandings);
    currentStandings.current = standings
    setAreStandingsSorted(true);
}

    return (
        <thead>
        <tr className="text-slate-300 bg-slate-800">
          <th className="text-xl bg-slate-800 z-10 sticky left-0 cursor-pointer" onClick={readHeader}>Team</th>
          {LEAGUE_TABLE_CATEGORIES.map((header, index) => (
            <th className="p-4 sm:text-xl cursor-pointer" key={index} onClick={readHeader}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
    )
}

export default TableHeaders;