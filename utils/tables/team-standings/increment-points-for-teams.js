// increments a teams total points. Property is named 'Pts'

function incrementPointsForTeams(
  arrayOfTeamObjects,
  currentPoints,
  teamsIndexNumber,
  getSeasonStandings
) {
  const getHomeTeamsCurrentPoints = arrayOfTeamObjects[teamsIndexNumber].Pts;
  arrayOfTeamObjects[teamsIndexNumber].Pts =
    getHomeTeamsCurrentPoints + currentPoints;
  return getSeasonStandings[teamsIndexNumber];
}

export default incrementPointsForTeams;
