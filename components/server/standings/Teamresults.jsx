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

  function tablePositionBorder(leagueName, lineNumber, isTableFiltered) {
    if(!isTableFiltered){
      switch(leagueName){
        case "q":
          if(lineNumber <=3){
            return "border-solid border-green-700 border-l-4"
          }
          if(lineNumber >=16){
            return "border-solid border-red-900 border-l-4"
          }
          return "border-solid border-blue-700 border-l-4"
        case "w":
          if(lineNumber >=16){
            return "border-solid border-red-900 border-l-4"
          }
          return "border-solid border-green-700 border-l-4"
        default:
          return ""
      }
    }
    return ""
  }

  return (
    <tr className={`${bgColor} text-sm h-10`}>
      {categories.map((category, index) => {
        let dynamicTextColor = bgColor;
        if (category === "Diff") {
          if (team[category] > 0) {
            dynamicTextColor = "text-green-700";
          }
          if (team[category] < 0) {
            dynamicTextColor = "text-red-900";
          }
        }
        if (index === 0) {
          return [
            <td key={`${index}-teamLogo`} className={`flex justify-center sticky left-0 ${bgColor}`}>
              <div className={`flex items-center h-10 my-1 px-2 ${tablePositionBorder(leagueName, lineNumber, isTableFiltered)}`}>
                <TeamLogo
                  name={team.teamLogo}
                  width={25}
                  height={15}
                  leagueName={leagueName}
                  seasonNumber={seasonNumber}
                />
              </div>
            </td>,
            <td key={index} category={category} className={`text-center ${dynamicTextColor} whitespace-nowrap`}>
              {(category === "Diff" && team[category] > 0) ? "+" + team[category] : team[category]}
            </td>
          ];
        } else {
          return (
            <td key={index} category={category} className={`text-center ${dynamicTextColor} whitespace-nowrap`}>
              {(category === "Diff" && team[category] > 0) ? "+" + team[category] : team[category]}
            </td>
          );
        }
      })}
    </tr>
  );
}

export default Teamresults;

