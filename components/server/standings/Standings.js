"use client";

import { useState, useEffect } from "react";
import { NextResponse } from "next/server";
import Teamresults from "./Teamresults";

function fetchLeagueTableData() {
  return new Promise((resolve, reject) => {
    try {
      const fetchTable = fetch(
        `http://localhost:3000/api/tables/league-table`,
        {
          next: {
            revalidate: 0,
          },
        }
      );
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
        standingsArray.sort((a, b) => b.Pts - a.Pts);
        setStandingsArray(standingsArray);
      })
      .catch((error) => console.log(error));
  }, [updateStandings]);

  return (
    <table className="m-auto table-auto">
      <thead>
        <tr>
          <th>Team</th>
          {tableCategories.map((header, index) => (
            <th className="p-4" key={index}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {standingsArray.map((team, index) => (
          <Teamresults key={index} team={team} categories={tableCategories} />
        ))}
      </tbody>
    </table>
  );
}
export default Standings;
