import Teamresults from "../standings/Teamresults";
import TableHeaders from "@/components/client/Tables/Table-headers";
import { LEAGUE_TABLE_CATEGORIES } from "@/utils/constants/constants";

function LeagueTable({ leagueName, seasonNumber, standings, isTableFiltered, setAreStandingsSorted, setSortedStandings, divisions}) {
  // remove teams from the standings display if that team will not complete it's season
  const filterOutTeamsOnHiatus = standings.filter(standing => !standing.isTeamOnHiatus)

// arrays that will hold teamAcronyms if the league has conferences
  let teamsInFirstConference = [];
  let teamsInSecondConference = [];
  // this checks if the league has conferences. No conferences means conference name is only one named "League"
  if(divisions[filterOutTeamsOnHiatus[0].teamAcronym].conference !== "League"){
    // only need to capture one conference name to compare to. 
    // if teams conference does not match then they belong in the second conference array
    const firstConference = divisions[filterOutTeamsOnHiatus[0].teamAcronym].conference;

    filterOutTeamsOnHiatus.forEach(team => {
      if(divisions[team.teamAcronym].conference === firstConference){
        teamsInFirstConference.push(team.teamAcronym)
      } else {
        teamsInSecondConference.push(team.teamAcronym)
      }
    })
    // trim the conference teams list to reflect playoff teams only
    teamsInFirstConference.splice(8)
    teamsInSecondConference.splice(8)
  }

function getBackgroundColor(leagueName, index){
  switch(leagueName){
    case "p":
      return index % 2 === 0 ? "bg-slate-300" : "bg-slate-400"
    case "q":
      if(index >= 16){
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
              firstConferenceList={teamsInFirstConference}
              secondConferenceList={teamsInSecondConference}
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
