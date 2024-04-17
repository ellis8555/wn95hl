// increments a teams wins property. Property is name 'W'

function incrementWinningTeamsWins(
  arrayOfTeamObjects,
  wasGameATie,
  winningTeamAcronym
) {
  let teamsStandingIndex;
  if (!wasGameATie) {
    arrayOfTeamObjects.forEach((team, index) => {
      if (team.teamAcronym === winningTeamAcronym) {
        teamsStandingIndex = index;
      }
    });
    arrayOfTeamObjects[teamsStandingIndex].W++;
  }
  return;
}

export default incrementWinningTeamsWins;
