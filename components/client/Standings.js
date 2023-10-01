"use client";

import { useEffect, useState } from "react";
import { useFullLeagueStandings } from "@/context/FullLeagueStandingsContext";
import LeagueTable from "../server/tables/LeagueTable";
import FilteredTable from "../server/tables/FilteredTable";
import { COMPONENT_TABLE_BUTTON } from "@/utils/constants/component_consts";

function Standings({ leagueName, seasonNumber, leagueTable, leagueStructure }) {
  const [standings, setStandings] = useState(leagueTable);
  const [conference, setConference] = useState("League");
  const [divisions] = useState(leagueStructure);
  const [isTableFiltered, setIsTableFiltered] = useState(false);
  const [splitTables, setSplitTables] = useState(false);
  const [component_table_button_args] = useState({
    standings,
    setStandings,
    divisions,
    setIsTableFiltered,
    setSplitTables,
    setConference,
  });

  const { clientSideStandings, refreshTheStandings, setRefreshTheStandings } =
    useFullLeagueStandings();

  useEffect(() => {
    if (refreshTheStandings) {
      setStandings(clientSideStandings);
      setRefreshTheStandings(false);
    }
  }, [clientSideStandings]);

  return (
    <>
      <div
        className="flex flex-row justify-center 
      gap-4 mt-4 lg:hidden"
      >
        {COMPONENT_TABLE_BUTTON("League", component_table_button_args)}
        {COMPONENT_TABLE_BUTTON(
          "Clarence Campbell",
          component_table_button_args
        )}
        {COMPONENT_TABLE_BUTTON("Prince of Wales", component_table_button_args)}
      </div>
      <div
        className="flex-row justify-center 
      gap-4 mt-4 hidden lg:flex"
      >
        {COMPONENT_TABLE_BUTTON("League", component_table_button_args)}
        {COMPONENT_TABLE_BUTTON("Conferences", component_table_button_args)}
      </div>
      <div className="lg:hidden">
        <div className="mt-3">
          <div className="text-2xl text-center">{conference}</div>
          <LeagueTable
            leagueName={leagueName}
            seasonNumber={seasonNumber}
            standings={standings}
            isTableFiltered={isTableFiltered}
          />
        </div>
      </div>
      <div className="hidden lg:flex flex-row justify-around">
        {splitTables ? (
          <div className="flex flex-row justify-around gap-8">
            <div className="mt-3">
              <div className="text-2xl text-center">Clarence Campbell</div>
              <FilteredTable
                confDivName="Clarence Campbell"
                leagueName={leagueName}
                seasonNumber={seasonNumber}
                standings={standings}
                divisions={divisions}
                isTableFiltered={isTableFiltered}
              />
            </div>
            <div className="mt-3">
              <div className="text-2xl text-center">Prince of Wales</div>
              <FilteredTable
                confDivName="Prince of Wales"
                leagueName={leagueName}
                seasonNumber={seasonNumber}
                standings={standings}
                divisions={divisions}
                isTableFiltered={isTableFiltered}
              />
            </div>
          </div>
        ) : (
          <div className="mt-3 w-3/4">
            <div className="text-2xl text-center">{conference}</div>
            <LeagueTable
              leagueName={leagueName}
              seasonNumber={seasonNumber}
              standings={standings}
              isTableFiltered={isTableFiltered}
            />
          </div>
        )}
      </div>
    </>
  );
}
export default Standings;
