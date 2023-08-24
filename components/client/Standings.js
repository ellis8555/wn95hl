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
  const [standingsArray, setStandingsArray] = useState([]);
  const [tableCategories, setTableCategories] = useState([
    "GP",
    "W",
    "L",
    "T",
    "OTL",
    "Pts",
  ]);

  useEffect(() => {
    fetchLeagueTableData()
      .then((data) => {
        const standingsArray = data[0]["standings"];
        standingsArray.sort((a, b) => {
          if (b.Pts - a.Pts !== 0) {
            return b.Pts - a.Pts;
          } else {
            return b.GP - a.GP;
          }
        });
        setStandingsArray(standingsArray);
      })
      .catch((error) => console.log(error));
  }, [updateStandings]);

  return (
    <div className="px-4">
      <table className="mb-4 mx-auto table-auto">
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
          {standingsArray.map((team, index) => (
            <Teamresults
              key={index}
              team={team}
              categories={tableCategories}
              bgColor={index % 2 === 0 ? "bg-slate-100" : "bg-white"}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default Standings;
