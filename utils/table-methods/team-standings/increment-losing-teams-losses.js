// increments a teams' losses property in an object. Property is named 'L'

function incrementLosingTeamsLosses(
  arrayOfTeamObjects,
  wasGameATie,
  wasOvertimeRequired,
  losingTeam
) {
  let teamsStandingIndex;
  if (!wasGameATie && !wasOvertimeRequired) {
    arrayOfTeamObjects.forEach((team, index) => {
      if (team.teamName === losingTeam) {
        teamsStandingIndex = index;
      }
    });
    arrayOfTeamObjects[teamsStandingIndex].L++;
  }
  return;
}

export default incrementLosingTeamsLosses;
