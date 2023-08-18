import MyImage from "./MyImage";

function Teamresults({ team, categories }) {
  return (
    <tr>
      <td>
        <MyImage name={team.teamAcronym} />
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
