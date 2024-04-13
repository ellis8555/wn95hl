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
    ///////////////////////////////////////
    // custom sort for teams current streak
    ///////////////////////////////////////

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
    //////////////////////////////////////////////
    // custom sort for teams current last 10 games
    //////////////////////////////////////////////
    // sort order is
    // 1. Pts
    // 2. Pts%
    // 3. Gf
    // then sort zero GP alphabetically

    if (header === "L10") {
      const sortedByLastTen = [...currentStandings.current].sort((a, b) => {
        // Check if any team has zero games played
        const hasZeroGamesA = a["GP"] === 0;
        const hasZeroGamesB = b["GP"] === 0;

        // If one team has zero games played and the other doesn't, sort accordingly
        if (hasZeroGamesA !== hasZeroGamesB) {
            return hasZeroGamesA ? 1 : -1;
        }

        // sort by points from last 10 games
    const ptsA = a["Last10"]["lastTenRecord"]["Pts"] ?? 0;
    const ptsB = b["Last10"]["lastTenRecord"]["Pts"] ?? 0;
    const winsA = a["W"];
    const winsB = b["W"];
    const ptsPercentA = a["Pts%"]
    const ptsPercentB = b["Pts%"]
    const aGoalsFor = a["Gf"]
    const bGoalsFor = b["Gf"]

    // If points are equal but wins are different, sort by wins
    if (ptsA === ptsB) {
        return winsB - winsA; // Sort by wins descending
    }

    // If points and wins are equal, sort by Pts%
    if (ptsA === ptsB && winsA === winsB) {
      return ptsPercentB - ptsPercentA; // Sort by Pts% descending
  }

    // If points and wins are equal, sort by Pts%
    if (ptsA === ptsB && winsA === winsB && ptsPercentA === ptsPercentB) {
      return bGoalsFor - aGoalsFor; // Sort by goals for
  }

    return ptsB - ptsA;
  });

      // Sort teams with zero games played alphabetically
      sortedByLastTen.sort((a, b) => {
        if (a["GP"] === 0 && b["GP"] === 0) {
            const teamNameA = a["teamName"];
            const teamNameB = b["teamName"];
            return teamNameA.localeCompare(teamNameB);
        }
        return 0;
    });

      setSortedStandings(sortedByLastTen);
      currentStandings.current = standings
      setAreStandingsSorted(true);
      return;
  }

  const sortedStandings = [...currentStandings.current].sort((a, b) => {
  // teamName is sorting strings
  if (header === "teamName" || header === "Manager"){
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
          <th className="text-xl bg-slate-800 z-10 sticky left-0 cursor-pointer pl-4" onClick={readHeader}>Team</th>
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