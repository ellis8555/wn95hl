// increments a teams' overtime loss column that is named 'OTL'

function incrementOvertimeLoss(
  arrayOfTeamObjects,
  wasGameATie,
  wasOvertimeRequired,
  losingTeam
) {
  let overtimeLosingTeamsIndex;
  if (!wasGameATie && wasOvertimeRequired) {
    arrayOfTeamObjects.forEach((standing, index) => {
      if (standing.teamName === losingTeam) {
        overtimeLosingTeamsIndex = index;
      }
    });
    arrayOfTeamObjects[overtimeLosingTeamsIndex].OTL++;
  }
}

export default incrementOvertimeLoss;
