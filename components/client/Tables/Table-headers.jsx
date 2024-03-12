'use client'

import { useState } from "react";
import { LEAGUE_TABLE_CATEGORIES } from "@/utils/constants/constants";

function TableHeaders({setAreStandingsSorted, setSortedStandings, standings}){

    const [currentStandings] = useState(standings)

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
    setSortedStandings(sortedStandings);
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