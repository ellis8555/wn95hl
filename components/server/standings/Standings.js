import Teamresults from "./Teamresults";

async function fetchLeagueTableData() {
  const fetchTable = await fetch(
    "http://127.0.0.1:3000/api/tables/league-table",
    {
      next: {
        revalidate: 0,
      },
    }
  );
  const getStandingsObject = await fetchTable.json();
  return getStandingsObject;
}

async function Standings() {
  const getStandingsObject = await fetchLeagueTableData();
  const standingsArray = getStandingsObject[0]["standings"];
  standingsArray.sort((a, b) => b.Pts - a.Pts);
  const tableCategories = ["GP", "W", "L", "T", "OTL", "Pts"];

  return (
    <table className="m-auto table-auto">
      <thead>
        <tr>
          <th>Team</th>
          {tableCategories.map((header, index) => (
            <th className="p-4" key={index}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {standingsArray.map((team, index) => (
          <Teamresults key={index} team={team} categories={tableCategories} />
        ))}
      </tbody>
    </table>
  );
}
export default Standings;
