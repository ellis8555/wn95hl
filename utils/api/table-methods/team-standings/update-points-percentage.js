function updatePointsPercentage(arrayOfTeamObjects, teamsStandingsIndex){
    const gamesPlayed = arrayOfTeamObjects[teamsStandingsIndex].GP;
    const totalPoints = arrayOfTeamObjects[teamsStandingsIndex].Pts

    const pointsPercentage = totalPoints/(gamesPlayed*2)
    const pointsTrimmed = "."+pointsPercentage.toFixed(3).split('.')[1];
    arrayOfTeamObjects[teamsStandingsIndex]["Pts%"] = pointsTrimmed.toString()
    return arrayOfTeamObjects[teamsStandingsIndex]
}

export default updatePointsPercentage;