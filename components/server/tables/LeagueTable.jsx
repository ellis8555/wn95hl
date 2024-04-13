import Teamresults from "../standings/Teamresults";
import TableHeaders from "@/components/client/Tables/Table-headers";
import { LEAGUE_TABLE_CATEGORIES } from "@/utils/constants/constants";

function LeagueTable({ leagueName, seasonNumber, standings, isTableFiltered, setAreStandingsSorted, setSortedStandings }) {
  // remove teams from the standings display if that team will not complete it's season
  const filterOutTeamsOnHiatus = standings.filter(standing => !standing.isTeamOnHiatus)

function getBackgroundColor(leagueName, index){
  switch(leagueName){
    case "p":
      return index % 2 === 0 ? "bg-slate-300" : "bg-slate-400"
    case "q":
      if(index >= 12){
        return index % 2 === 0 ? "bg-gray-500" : "bg-gray-400"
      }
      return index % 2 === 0 ? "bg-slate-300" : "bg-slate-400"
    case "w":
      if(index >= 16){
        return index % 2 === 0 ? "bg-gray-500" : "bg-gray-400"
      }
      return index % 2 === 0 ? "bg-slate-300" : "bg-slate-400"
    case "v":
      return index % 2 === 0 ? "bg-slate-300" : "bg-slate-400"
  }
}

  return (
    <div className="overflow-auto">
    <table className="my-4 w-full md:w-3/4 md:mx-auto table-auto">
    <TableHeaders leagueName={leagueName} seasonNumber={seasonNumber} standings={filterOutTeamsOnHiatus} setAreStandingsSorted={setAreStandingsSorted} setSortedStandings={setSortedStandings}/>
      <tbody>
        {filterOutTeamsOnHiatus.length > 0 ? (
          filterOutTeamsOnHiatus.map((team, index) => (
            <Teamresults
              key={index}
              lineNumber={index}
              team={team}
              categories={LEAGUE_TABLE_CATEGORIES}
              leagueName={leagueName}
              seasonNumber={seasonNumber}
              isTableFiltered={isTableFiltered}
              bgColor={getBackgroundColor(leagueName, index)}
            />
          ))
        ) : (
          <tr>
            <td
              className="text-center"
              colSpan={LEAGUE_TABLE_CATEGORIES.length + 1}
            >
              Season {seasonNumber} of the {leagueName.toUpperCase()} league has
              zero games played yet
            </td>
          </tr>
        )}
      </tbody>
    </table>
    </div>
  );
}

export default LeagueTable;
