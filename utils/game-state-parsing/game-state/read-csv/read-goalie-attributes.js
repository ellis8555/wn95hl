// Function to read and process the CSV file using async/await

async function readGoalieAttributes(leagueName, seasonNumber) {
  const goalieCsvFile = `/csv/${leagueName}/${seasonNumber}/Goalie_Attributes.csv`;

  const goaliesArray = [];
  const goaliesContainingObject = {};

  try {
    const response = await fetch(goalieCsvFile);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const goalieAttributes = await response.text();

    // Split the CSV data into rows
    const rows = goalieAttributes.split("\n").map((row) => row.trimEnd("\r"));
    // start at index one to skip headers
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].split(",");

      // Check if the row contains only commas
      if (row.join("").trim() === "") {
        // Skip this row as it's empty
        continue;
      }
      goaliesArray.push(row);
    }

    let curTeam = "";
    goaliesArray.forEach((goalieRow) => {
      if (goalieRow[1] !== curTeam) {
        curTeam = goalieRow[1];
        goaliesContainingObject[curTeam] = [goalieRow[0]];
      } else {
        goaliesContainingObject[curTeam].push(goalieRow[0]);
      }
    });
    return goaliesContainingObject;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

export default readGoalieAttributes;
