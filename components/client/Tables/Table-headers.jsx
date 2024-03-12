'use client'

import { useState } from "react";
import { LEAGUE_TABLE_CATEGORIES } from "@/utils/constants/constants";
import { useFullLeagueStandings } from "@/context/FullLeagueStandingsContext";

function TableHeaders({leagueName, seasonNumber, standings}){
    const [currentStandings, setCurrentStandings] = useState(standings)
    const [currentLeague, setCurrentLeague] = useState(leagueName)
    const [currentSeasonNumber, setCurrentSeasonNumber] = useState(seasonNumber)

    const {
        setClientSideStandings,
        setRefreshTheStandings,
        setLeagueContext,
        setSeasonNumberContext
      } = useFullLeagueStandings();

function readHeader(e){
    let header = e.target.textContent
    if(header === "Team"){
        header = "teamName"
    }
    const sortedStandings = [...currentStandings].sort((a, b) => {
        if(header === "teamName" || header === "Strk"){
            return a[header].localeCompare(b[header]);
        } else {
            return b[header] - a[header]
        }
    });
    setLeagueContext(currentLeague)
    setSeasonNumberContext(currentSeasonNumber)
    setClientSideStandings(sortedStandings);
    setRefreshTheStandings(true);
}

    return (
        <thead>
        <tr className="text-slate-300 bg-slate-800">
          <th className="text-xl bg-slate-800 z-10 sticky left-0" onClick={readHeader}>Team</th>
          {LEAGUE_TABLE_CATEGORIES.map((header, index) => (
            <th className="p-4 sm:text-xl" key={index} onClick={readHeader}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
    )
}

export default TableHeaders;