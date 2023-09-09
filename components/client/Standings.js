"use client";

import { useState, useEffect, useRef } from "react";
import { NextResponse } from "next/server";
import Teamresults from "../server/standings/Teamresults";

function Standings({
  updateStandings,
  leagueName,
  seasonNumber,
  setServerMessage,
}) {
  const [standingsArray, setStandingsArray] = useState([]);
  const [filteredStandings, setFilteredStandings] = useState([]);
  const [areStandingsFiltered, setAreStandingsFiltered] = useState(false);
  const [leagueStructure, setLeagueStructure] = useState({});
  const [tableCategories, setTableCategories] = useState([
    "GP",
    "W",
    "L",
    "T",
    "OTL",
    "Pts",
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const conferenceNameRef = useRef("league");

  function fetchLeagueTableData() {
    return new Promise((resolve, reject) => {
      try {
        const fetchTable = fetch(
          `/api/season-data?league=${leagueName}&season-number=${seasonNumber}&field=standings`,
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
          .then((getStandingsAndLeagueStructure) => {
            // this data is an object containing standings array
            // and also the divisions and conferences for the league
            if (getStandingsAndLeagueStructure.standings.length > 0) {
              resolve(getStandingsAndLeagueStructure);
            } else {
              reject("There is no data for this season");
            }
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  useEffect(() => {
    fetchLeagueTableData()
      .then((standingsAndStructure) => {
        setLeagueStructure(standingsAndStructure.leagueStructure);
        const standingsArray = standingsAndStructure.standings;
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
        setServerMessage(error);
        setIsLoading(false);
      });
  }, [updateStandings]);

  useEffect(() => {
    if (standingsArray.length > 0) {
      filterStandings(conferenceNameRef.current);
    }
  }, [standingsArray]);

  function filterStandings(conference = "league") {
    if (conference === "league") {
      conferenceNameRef.current = leagueName;
      setFilteredStandings(standingsArray);
      setAreStandingsFiltered(false);
      return;
    }

    const conferenceStandings = standingsArray.filter((eachTeam) => {
      if (leagueStructure[eachTeam.teamAcronym].conference === conference) {
        return eachTeam;
      }
    });

    conferenceNameRef.current = conference;
    setFilteredStandings(conferenceStandings);
    setAreStandingsFiltered(true);
  }

  return (
    <div className="mt-3">
      <div className="flex flex-row justify-center gap-2">
        <button
          className="bg-slate-300 rounded-full p-2"
          onClick={() => filterStandings()}
        >
          League
        </button>
        <button
          className="bg-slate-300 rounded-full p-2"
          onClick={() => filterStandings("Prince of Wales")}
        >
          Prince of Wales
        </button>
        <button
          className="bg-slate-300 rounded-full p-2"
          onClick={() => filterStandings("Clarence Campbell")}
        >
          Clarence Campbell
        </button>
      </div>

      <h1 className="mt-3 text-3xl text-center">
        The {conferenceNameRef.current}
      </h1>

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
              <td className="text-center" colSpan={tableCategories.length + 1}>
                Table is Loading...
              </td>
            </tr>
          ) : (areStandingsFiltered ? filteredStandings : standingsArray)
              .length > 0 ? (
            (areStandingsFiltered ? filteredStandings : standingsArray).map(
              (team, index) => (
                <Teamresults
                  key={index}
                  team={team}
                  categories={tableCategories}
                  bgColor={index % 2 === 0 ? "bg-slate-200" : "bg-white"}
                />
              )
            )
          ) : (
            <tr>
              <td className="text-center" colSpan={tableCategories.length + 1}>
                No games have been played
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
export default Standings;
