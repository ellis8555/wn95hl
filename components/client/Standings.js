"use client";

import { useState } from "react";

import Teamresults from "../server/standings/Teamresults";
import { LEAGUE_TABLE_CATEGORIES } from "@/utils/constants/constants";
import { COMPONENT_TABLE_BUTTON } from "@/utils/constants/component_consts";

function Standings({ leagueName, seasonNumber, leagueTable, leagueStructure }) {
  const [standings, setStandings] = useState(leagueTable);
  const [divisions] = useState(leagueStructure);
  const [isTableFiltered, setIsTableFiltered] = useState(false);
  const [component_table_button_args] = useState({
    standings,
    setStandings,
    divisions,
    setIsTableFiltered,
  });

  return (
    <>
      <div className="flex flex-row justify-center gap-4">
        {COMPONENT_TABLE_BUTTON("League", component_table_button_args)}
        {COMPONENT_TABLE_BUTTON(
          "Clarence Campbell",
          component_table_button_args
        )}
        {COMPONENT_TABLE_BUTTON("Prince of Wales", component_table_button_args)}
      </div>
      <div className="mt-3">
        <table className="mb-4 w-full md:w-3/4 md:mx-auto table-auto">
          <thead>
            <tr>
              <th className="text-xl">W95</th>
              {LEAGUE_TABLE_CATEGORIES.map((header, index) => (
                <th className="p-4 sm:text-xl" key={index}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {standings.length > 0 ? (
              standings.map((team, index) => (
                <Teamresults
                  key={index}
                  lineNumber={index}
                  team={team}
                  categories={LEAGUE_TABLE_CATEGORIES}
                  isTableFiltered={isTableFiltered}
                  bgColor={index % 2 === 0 ? "bg-slate-200" : "bg-white"}
                />
              ))
            ) : (
              <tr>
                <td
                  className="text-center"
                  colSpan={LEAGUE_TABLE_CATEGORIES.length + 1}
                >
                  Season {seasonNumber} of the {leagueName.toUpperCase()} league
                  has zero games played yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
export default Standings;
