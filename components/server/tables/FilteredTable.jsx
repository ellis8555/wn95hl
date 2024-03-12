import Teamresults from "../standings/Teamresults";
import TableHeaders from "@/components/client/Tables/Table-headers";
import { LEAGUE_TABLE_CATEGORIES } from "@/utils/constants/constants";

function FilteredTable({
  confDivName,
  leagueName,
  seasonNumber,
  standings,
  divisions,
  isTableFiltered,
}) {
  return (
    <div className="overflow-auto">
    <table className="my-4 w-full md:w-3/4 md:mx-auto table-auto">
<TableHeaders leagueName={leagueName} seasonNumber={seasonNumber} standings={standings}/>
      <tbody>
        {standings.length > 0 ? (
          standings
            .filter((team) => {
              if (divisions[team.teamAcronym].conference == confDivName) {
                return team;
              }
              return;
            })
            .map((team, index) => (
              <Teamresults
                key={index}
                lineNumber={index}
                team={team}
                categories={LEAGUE_TABLE_CATEGORIES}
                isTableFiltered={isTableFiltered}
                bgColor={index % 2 === 0 ? "bg-slate-300" : "bg-slate-400"}
                leagueName={leagueName}
                seasonNumber={seasonNumber}
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

export default FilteredTable;
