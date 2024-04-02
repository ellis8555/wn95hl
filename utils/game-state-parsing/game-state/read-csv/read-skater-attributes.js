// Function to read and process the CSV file using async/await

async function readSkatersAttributes(leagueName, seasonNumber) {
  const skaterCsvFile = `/csv/${leagueName}/${seasonNumber}/Skater_Attributes.csv`;

  const skatersArray = [];
  const skatersContainingObject = {};

  try {
    const response = await fetch(skaterCsvFile);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const skatersAttributes = await response.text();

    // Split the CSV data into rows
    const rows = skatersAttributes.split("\n").map((row) => row.trimEnd("\r"));
    // start at index one to skip headers
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].split(",");

      // Check if the row contains only commas
      if (row.join("").trim() === "") {
        // Skip this row as it's empty
        continue;
      }
      skatersArray.push(row);
    }

    let curTeam = "";
    skatersArray.forEach((skaterRow) => {
      if (skaterRow[1] !== curTeam) {
        curTeam = skaterRow[1];
        skatersContainingObject[curTeam] = [skaterRow[0]];
      } else {
        skatersContainingObject[curTeam].push(skaterRow[0]);
      }
    });
    return skatersContainingObject;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

export default readSkatersAttributes;
