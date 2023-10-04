// increments the tie property for both home and away team.
// property is named 'T'

function incrementTiesForTieGame(
  arrayOfTeamObjects,
  wasGameATie,
  homeTeamsIndex,
  awayTeamsIndex
) {
  if (wasGameATie) {
    arrayOfTeamObjects[homeTeamsIndex].T++;
    arrayOfTeamObjects[awayTeamsIndex].T++;
  }
}

export default incrementTiesForTieGame;
