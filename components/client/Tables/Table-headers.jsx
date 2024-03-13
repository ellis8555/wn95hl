'use client'

import { useState } from "react";
import { LEAGUE_TABLE_CATEGORIES } from "@/utils/constants/constants";

function TableHeaders({setAreStandingsSorted, setSortedStandings, standings}){

    let [currentStandings, setCurrentStandings] = useState(standings)

function readHeader(e){
    let header = e.target.textContent
    if(header === "Team"){
        header = "teamName"
    }

    if (header === "Strk") {
      const sortedByStrk = [...currentStandings].sort((a, b) => {
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
      setAreStandingsSorted(true);
      return;
  }

    const sortedStandings = [...currentStandings].sort((a, b) => {
  if (header === "teamName"){
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