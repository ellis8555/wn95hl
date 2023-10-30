import TeamLogo from "./TeamLogo";

function Teamresults({
  team,
  categories,
  bgColor,
  lineNumber,
  isTableFiltered,
}) {
  return (
    <tr
      className={`${bgColor} text-sm ${
        isTableFiltered
          ? lineNumber === 7
            ? "border-slate-600 border-b-2"
            : ""
          : lineNumber === 15
          ? "border-slate-600 border-b-2"
          : ""
      } h-10`}
    >
      <td className="flex justify-center">
        <div className="flex items-center h-10">
          <TeamLogo name={team.teamAcronym} width={25} height={15} />
        </div>
      </td>
      {categories.map((category, index) => (
        <td key={index} category={category} className="text-center">
          {team[category]}
        </td>
      ))}
    </tr>
  );
}

export default Teamresults;
