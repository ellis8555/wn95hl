// sets  teams goals against average

function updateGoalsAgainstAverage(arrayOfStandingsObjects, teamsIndexInStandings) {
  const gamesPlayed = arrayOfStandingsObjects[teamsIndexInStandings].GP;
  const goalsAgainst = arrayOfStandingsObjects[teamsIndexInStandings].Ga;
  const updatedGaa = (goalsAgainst / gamesPlayed).toFixed(2);

  arrayOfStandingsObjects[teamsIndexInStandings].Gaa = updatedGaa
}

export default updateGoalsAgainstAverage