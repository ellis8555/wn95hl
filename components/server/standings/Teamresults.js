import TeamLogo from "./TeamLogo";

function Teamresults({ team, categories }) {
  return (
    <tr>
      <td>
        <TeamLogo name={team.teamAcronym} />
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
