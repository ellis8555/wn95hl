import TeamLogo from "./TeamLogo";

function Teamresults({ team, categories, bgColor }) {
  return (
    <tr className={`${bgColor} text-sm`}>
      <td className="flex justify-center">
        <TeamLogo name={team.teamAcronym} width={25} height={15} />
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
