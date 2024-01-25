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
  conferences,
}) {
  const [standings, setStandings] = useState(leagueTable);
  const [updateSeasonNumber, setUpdateSeasonNumber] = useState(seasonNumber);
  const [conferenceDetails, setConferenceDetails] = useState(conferences);
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
    conferenceDetails,
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
      {conferenceDetails.length > 1 && (
        <div
          className="flex flex-row justify-center 
      gap-4 mt-4 md:hidden"
        >
          {COMPONENT_TABLE_BUTTON("League", component_table_button_args)}
          {conferenceDetails.map((eachConf) =>
            COMPONENT_TABLE_BUTTON(eachConf.name, component_table_button_args)
          )}
        </div>
      )}
      {/* medium screens has button for 'conferences' which split screens tables for each conference */}
      {conferenceDetails.length > 1 && (
        <div
          className="flex-row justify-center 
      gap-4 mt-4 hidden md:flex"
        >
          {COMPONENT_TABLE_BUTTON("League", component_table_button_args)}
          {COMPONENT_TABLE_BUTTON("Conferences", component_table_button_args)}
        </div>
      )}
      {/* small screens only ever display single table */}
      <div className="md:hidden">
        <div className="mt-3">
          {conference === "League" ? (
            <div className="flex justify-center">
              <LeagueLogo name={leagueName} width={75} height={75} />
            </div>
          ) : (
            <div className="flex justify-center">
              {conferenceDetails.map((eachConf) => {
                return conference === eachConf.name ? (
                  <LeagueLogo
                    key={eachConf.name}
                    name={eachConf.logo}
                    width={75}
                    height={75}
                  />
                ) : null;
              })}
            </div>
          )}
          <LeagueTable
            leagueName={leagueName}
            seasonNumber={updateSeasonNumber}
            standings={standings}
            isTableFiltered={isTableFiltered}
          />
        </div>
      </div>
      {/* medium screens displays conferences via multiple tables on page */}
      <div className="hidden md:flex flex-row justify-around">
        {splitTables ? (
          <div className="flex flex-row justify-around gap-8">
            {conferenceDetails.map((eachConf) => (
              <div className="mt-3" key={eachConf.name}>
                <div className="flex justify-center">
                  <LeagueLogo name={eachConf.logo} width={75} height={75} />
                </div>
                <FilteredTable
                  confDivName={eachConf.name}
                  leagueName={leagueName}
                  seasonNumber={updateSeasonNumber}
                  standings={standings}
                  divisions={divisions}
                  isTableFiltered={isTableFiltered}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-3 w-3/4">
            {conference === "League" ? (
              <div className="flex justify-center">
                <LeagueLogo name={leagueName} width={75} height={75} />
              </div>
            ) : (
              <div className="flex justify-center">
                {conferenceDetails.map((eachConf) => {
                  return conference === eachConf.name ? (
                    <LeagueLogo
                      key={eachConf.name}
                      name={eachConf.logo}
                      width={75}
                      height={75}
                    />
                  ) : null;
                })}
              </div>
            )}
            <LeagueTable
              leagueName={leagueName}
              seasonNumber={updateSeasonNumber}
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
