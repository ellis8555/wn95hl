// increments a teams games played property where the property is named 'GP'

function incrementGamesPlayed(
  arrayOfTeamObjects,
  homeTeamsIndex,
  awayTeamsIndex
) {
  arrayOfTeamObjects[homeTeamsIndex].GP++;
  arrayOfTeamObjects[awayTeamsIndex].GP++;
}

export default incrementGamesPlayed;
