// sets  teams goals for average

function updateGoalsForAverage(arrayOfStandingsObjects, teamsIndexInStandings) {
    const gamesPlayed = arrayOfStandingsObjects[teamsIndexInStandings].GP;
    const goalsFor = arrayOfStandingsObjects[teamsIndexInStandings].Gf;
    const updatedGfa = (goalsFor / gamesPlayed).toFixed(2);
  
    arrayOfStandingsObjects[teamsIndexInStandings].Gfa = updatedGfa
  }
  
  export default updateGoalsForAverage