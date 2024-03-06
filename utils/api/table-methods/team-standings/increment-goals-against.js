// increments teams total goals against in standings table

function incrementGoalsAgainst(arrayOfStandingsObjects, teamsIndexInStandings, previousGoalsAgainstTotals, gameGoalsAgainst){
    arrayOfStandingsObjects[teamsIndexInStandings].Ga = previousGoalsAgainstTotals + gameGoalsAgainst
}

export default incrementGoalsAgainst;