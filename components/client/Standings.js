"use client";

import { useState, useEffect } from "react";
import { NextResponse } from "next/server";
import Teamresults from "../server/standings/Teamresults";

function fetchLeagueTableData() {
  return new Promise((resolve, reject) => {
    try {
      const fetchTable = fetch(`/api/tables/league-table`, {
        next: {
          revalidate: 0,
        },
      });
      fetchTable
        .then((response) => {
          if (!response.ok) {
            return NextResponse.json({
              message: "Error fetching the table data",
            });
          }

          return response.json();
        })
        .then((getStandingsObject) => {
          resolve(getStandingsObject);
        });
    } catch (error) {
      reject(error);
    }
  });
}

function Standings({ updateStandings }) {
  const [standingsArray, setStandingsArray] = useState([updateStandings]);
  const [tableCategories, setTableCategories] = useState([
    "GP",
    "W",
    "L",
    "T",
    "OTL",
    "Pts",
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeagueTableData()
      .then((data) => {
        const standingsArray = data[0]["standings"];
        standingsArray.sort((a, b) => {
          // First, sort by 'Pts' property in descending order
          if (b.Pts - a.Pts !== 0) {
            return b.Pts - a.Pts;
          } else if (b.GP - a.GP !== 0) {
            return b.GP - a.GP;
          } else {
            // If 'Pts' and 'GP' are equal, check 'GP' values for zero
            if (a.GP === 0 && b.GP === 0) {
              // If both 'GP' values are 0, sort by 'teamName' in ascending order
              return a.teamName.localeCompare(b.teamName);
            } else if (a.GP === 0) {
              // If 'GP' of 'a' is 0, it comes first
              return -1;
            } else if (b.GP === 0) {
              // If 'GP' of 'b' is 0, it comes first
              return 1;
            } else {
              // If 'GP' values are non-zero and equal, sort by 'teamName'
              return a.teamName.localeCompare(b.teamName);
            }
          }
        });

        setStandingsArray(standingsArray);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [standingsArray]);

  return (
    <table className="mb-4 w-full md:w-3/4 md:mx-auto table-auto">
      <thead>
        <tr>
          <th className="text-xl">W95</th>
          {tableCategories.map((header, index) => (
            <th className="p-4 sm:text-xl" key={index}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td colSpan={tableCategories.length + 1}>Table is Loading...</td>
          </tr>
        ) : (
          standingsArray.map((team, index) => (
            <Teamresults
              key={index}
              team={team}
              categories={tableCategories}
              bgColor={index % 2 === 0 ? "bg-slate-200" : "bg-white"}
            />
          ))
        )}
      </tbody>
    </table>
  );
}
export default Standings;
