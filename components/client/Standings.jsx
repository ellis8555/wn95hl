"use client";

import { useEffect, useState } from "react";
import { useFullLeagueStandings } from "@/context/FullLeagueStandingsContext";
import LeagueTable from "../server/tables/LeagueTable";
import FilteredTable from "../server/tables/FilteredTable";
import LeagueLogo from "../server/Logos/LeagueLogo";
import { COMPONENT_TABLE_BUTTON } from "@/utils/constants/component_consts";

function Standings({
  leagueName,
  seasonNumber,
  leagueTable,
  leagueStructure,
  conferenceNames,
}) {
  const [standings, setStandings] = useState(leagueTable);
  const { conferences } = conferenceNames;
  const [conferenceNamesList, setConferenceNamesList] = useState(conferences);
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
    conferenceNamesList,
  });

  const { clientSideStandings, refreshTheStandings } = useFullLeagueStandings();

  useEffect(() => {
    if (refreshTheStandings) {
      setStandings(clientSideStandings);
    }
  }, [clientSideStandings]);
  return (
    <>
      {/* smaller screens have button for each conference name */}
      <div
        className="flex flex-row justify-center 
      gap-4 mt-4 md:hidden"
      >
        {COMPONENT_TABLE_BUTTON("League", component_table_button_args)}
        {COMPONENT_TABLE_BUTTON(
          "Clarence Campbell",
          component_table_button_args
        )}
        {COMPONENT_TABLE_BUTTON("Prince of Wales", component_table_button_args)}
      </div>
      {/* medium screens has button for 'conferences' which split screens tables for each conference */}
      <div
        className="flex-row justify-center 
      gap-4 mt-4 hidden md:flex"
      >
        {COMPONENT_TABLE_BUTTON("League", component_table_button_args)}
        {COMPONENT_TABLE_BUTTON("Conferences", component_table_button_args)}
      </div>
      {/* small screens only ever display single table */}
      <div className="md:hidden">
        <div className="mt-3">
          {conference === "League" ? (
            <div className="flex justify-center">
              <LeagueLogo name="w" width={75} height={75} />
            </div>
          ) : (
            <div className="flex justify-center">
              {conference === "Clarence Campbell" && (
                <LeagueLogo name="clarenceCampbell" width={75} height={75} />
              )}
              {conference === "Prince of Wales" && (
                <LeagueLogo name="princeOfWales" width={75} height={75} />
              )}
            </div>
          )}
          <LeagueTable
            leagueName={leagueName}
            seasonNumber={seasonNumber}
            standings={standings}
            isTableFiltered={isTableFiltered}
          />
        </div>
      </div>
      {/* medium screens displays conferences via multiple tables on page */}
      <div className="hidden md:flex flex-row justify-around">
        {splitTables ? (
          <div className="flex flex-row justify-around gap-8">
            <div className="mt-3">
              <div className="flex justify-center">
                <LeagueLogo name="clarenceCampbell" width={75} height={75} />
              </div>
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
              <div className="flex justify-center">
                <LeagueLogo name="princeOfWales" width={75} height={75} />
              </div>
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
            {conference === "League" ? (
              <div className="flex justify-center">
                <LeagueLogo name="w" width={75} height={75} />
              </div>
            ) : (
              <div className="flex justify-center">
                {conference === "Clarence Campbell" && (
                  <LeagueLogo name="clarenceCampbell" width={75} height={75} />
                )}
                {conference === "Prince of Wales" && (
                  <LeagueLogo name="princeOfWales" width={75} height={75} />
                )}
              </div>
            )}
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
