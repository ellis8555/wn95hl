import Teamresults from "../standings/Teamresults";
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
    <table className="mb-4 w-full md:w-3/4 md:mx-auto table-auto">
      <thead>
        <tr>
          <th className="text-xl">Team</th>
          {LEAGUE_TABLE_CATEGORIES.map((header, index) => (
            <th className="p-4 sm:text-xl" key={index}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
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
                bgColor={index % 2 === 0 ? "bg-slate-200" : "bg-white"}
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
  );
}

export default FilteredTable;
