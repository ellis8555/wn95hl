// update teams record over teams last 10 games

function updateTeamsLastTen(
    arrayOfTeamObjects,
    wasGameATie,
    teamsStandingsIndex,
    teamsPoints
  ) {

    // the points system in order to properly adjust the pts field in lastTenRecord
    const resultPointsDirectory = {
        "W": 2,
        "L": 0,
        "T": 1,
        "OTL": 1,
    }
    // get the last 10 results if exists or create templates
      const lastTenArray = arrayOfTeamObjects[teamsStandingsIndex]["Last10"]["lastTenArray"] || []
      const lastTenRecord = arrayOfTeamObjects[teamsStandingsIndex]["Last10"]["lastTenRecord"] || {
          "W": 0,
          "L": 0,
          "T": 0,
          "OTL": 0,
          "Pts": 0,
        }

      // determine result type
      let teamResult;

      if(teamsPoints == 2){
        teamResult = "W"
      } else if(wasGameATie){
        teamResult = "T"
      } else if(teamsPoints == 1){
        teamResult = "OTL"
      } else {
        teamResult = "L"
      }

      // if team has less than 10 games played
      if(lastTenArray.length < 10){
        lastTenArray.push(teamResult)
        lastTenRecord["Pts"] += resultPointsDirectory[teamResult]
        // if team has played 10 or more games
      } else {
        // get the oldest result or the 10th game played and reduce game type by 1 and remove pts from that game
        const oldestResult = lastTenArray[0];
        lastTenRecord[oldestResult] -= 1;
        lastTenRecord["Pts"] -= resultPointsDirectory[oldestResult]
        // add points for the most recent result
        lastTenRecord["Pts"] += resultPointsDirectory[teamResult]
        // remove the 10th game from the array 
        lastTenArray.splice(0, 1);
        // add the most recent game
        lastTenArray.push(teamResult)
      }

      // regardless of how many games played adjust either W, L, T, OTL
      lastTenRecord[teamResult] += 1;
      // update what is displayed on the webpage
      arrayOfTeamObjects[teamsStandingsIndex]["L10"] = `(${lastTenRecord["W"].toString()}-${lastTenRecord["L"].toString()}-${lastTenRecord["T"].toString()}-${lastTenRecord["OTL"].toString()})`;
    }
  
  export default updateTeamsLastTen;