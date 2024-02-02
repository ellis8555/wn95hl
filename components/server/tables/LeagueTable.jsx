import Teamresults from "../standings/Teamresults";
import { LEAGUE_TABLE_CATEGORIES } from "@/utils/constants/constants";

function LeagueTable({ leagueName, seasonNumber, standings, isTableFiltered }) {
  return (
    <table className="my-4 w-full md:w-3/4 md:mx-auto table-auto">
      <thead>
        <tr className="text-slate-300  sticky top-[81px] bg-slate-800">
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
          standings.map((team, index) => (
            <Teamresults
              key={index}
              lineNumber={index}
              team={team}
              categories={LEAGUE_TABLE_CATEGORIES}
              leagueName={leagueName}
              seasonNumber={seasonNumber}
              isTableFiltered={isTableFiltered}
              bgColor={index % 2 === 0 ? "bg-slate-300" : "bg-slate-400"}
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

export default LeagueTable;
