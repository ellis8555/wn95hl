// increments teams total goals for in standings table

function incrementGoalsFor(arrayOfStandingsObjects, teamsIndexInStandings, previousGoalsForTotals, gameGoalsFor){
    arrayOfStandingsObjects[teamsIndexInStandings].Gf = previousGoalsForTotals + gameGoalsFor
}

export default incrementGoalsFor;