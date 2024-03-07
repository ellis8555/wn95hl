// adjusts teams goal differential

function setTeamsGoalsDiff(arrayOfStandingsObjects, teamsIndexInStandings){
    // get goals for
    const goalsFor = arrayOfStandingsObjects[teamsIndexInStandings].Gf
    // get goals against
    const goalsAgainst = arrayOfStandingsObjects[teamsIndexInStandings].Ga

    // set total goals differential
arrayOfStandingsObjects[teamsIndexInStandings].Diff = goalsFor - goalsAgainst
}

export default setTeamsGoalsDiff;