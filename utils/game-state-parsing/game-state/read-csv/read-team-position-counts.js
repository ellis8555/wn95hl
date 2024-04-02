// Function to read and process the CSV file using async/await

async function readTeamPositionCounts(leagueName, seasonNumber) {
  const teamCsvFile = `/csv/${leagueName}/${seasonNumber}/Team_Position_Counts.csv`;

  const teamsArray = [];
  const teamsContainingObject = {};

  try {
    const response = await fetch(teamCsvFile);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const teamsAttributes = await response.text();

    // Split the CSV data into rows
    const rows = teamsAttributes.split("\n").map((row) => row.trimEnd("\r"));
    // start at index one to skip headers
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].split(",");

      // Check if the row contains only commas
      if (row.join("").trim() === "") {
        // Skip this row as it's empty
        continue;
      }
      teamsArray.push(row);
    }
    teamsArray.forEach((teamRow) => {
      teamsContainingObject[teamRow[0]] = {};
      teamsContainingObject[teamRow[0]]["goalies"] = teamRow[1];
      teamsContainingObject[teamRow[0]]["forwards"] = teamRow[2];
      teamsContainingObject[teamRow[0]]["defensemen"] = teamRow[3];
    });
    return teamsContainingObject;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

export default readTeamPositionCounts;
