// increments a teams' losses property in an object. Property is named 'L'

function incrementLosingTeamsLosses(
  arrayOfTeamObjects,
  wasGameATie,
  wasOvertimeRequired,
  losingTeamAcronym
) {
  let teamsStandingIndex;
  if (!wasGameATie && !wasOvertimeRequired) {
    arrayOfTeamObjects.forEach((team, index) => {
      if (team.teamAcronym === losingTeamAcronym) {
        teamsStandingIndex = index;
      }
    });
    arrayOfTeamObjects[teamsStandingIndex].L++;
  }
  return;
}

export default incrementLosingTeamsLosses;
