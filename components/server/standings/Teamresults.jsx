import TeamLogo from "../Logos/TeamLogo";

function Teamresults({
  team,
  categories,
  bgColor,
  lineNumber,
  isTableFiltered,
  leagueName,
  seasonNumber,
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
      <td className={`flex justify-center sticky left-0 ${bgColor}`}>
        <div className="flex items-center h-10">
          <TeamLogo
            name={team.teamLogo}
            width={25}
            height={15}
            leagueName={leagueName}
            seasonNumber={seasonNumber}
          />
        </div>
      </td>
      {categories.map((category, index) => {
        // adjust color for goals diff column to set dynamic colors
        let dynamicTextColor = {bgColor};
        if(category === "Diff"){
          if(team[category] > 0){
            dynamicTextColor = "text-green-700"
          }
          if(team[category] < 0){
            dynamicTextColor = "text-red-900"
          }
        }
      return (
        <td key={index} category={category} className={`text-center ${dynamicTextColor}`}>
          {team[category]}
        </td>
      )})}
    </tr>
  );
}

export default Teamresults;
