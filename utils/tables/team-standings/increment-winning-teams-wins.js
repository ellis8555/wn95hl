// increments a teams wins property. Property is name 'W'

function incrementWinningTeamsWins(
  arrayOfTeamObjects,
  wasGameATie,
  winningTeam
) {
  let teamsStandingIndex;
  if (!wasGameATie) {
    arrayOfTeamObjects.forEach((team, index) => {
      if (team.teamName === winningTeam) {
        teamsStandingIndex = index;
      }
    });
    arrayOfTeamObjects[teamsStandingIndex].W++;
  }
  return;
}

export default incrementWinningTeamsWins;
