function updatePointsPercentage(arrayOfTeamObjects, teamsStandingsIndex){
    // get total games played by team
    const gamesPlayed = arrayOfTeamObjects[teamsStandingsIndex].GP;
    // get teams total points
    const totalPoints = arrayOfTeamObjects[teamsStandingsIndex].Pts
    // calculate teams point percentage
    const pointsPercentage = totalPoints/(gamesPlayed*2)
    // check if team has all wins in order to display 1.000
    let pointsTrimmed
    if((gamesPlayed > 0) && (gamesPlayed*2 ) === totalPoints){
        pointsTrimmed = "1."+pointsPercentage.toFixed(3).split('.')[1];
    } else {
        // team does not have all wins therefore format is .ddd
        pointsTrimmed = "."+pointsPercentage.toFixed(3).split('.')[1];
    }
    arrayOfTeamObjects[teamsStandingsIndex]["Pts%"] = pointsTrimmed.toString()
    return arrayOfTeamObjects[teamsStandingsIndex]
}

export default updatePointsPercentage;