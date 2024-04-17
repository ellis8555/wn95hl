// increments a teams' overtime loss column that is named 'OTL'

function incrementOvertimeLoss(
  arrayOfTeamObjects,
  wasGameATie,
  wasOvertimeRequired,
  losingTeamAcronym
) {
  let overtimeLosingTeamsIndex;
  if (!wasGameATie && wasOvertimeRequired) {
    arrayOfTeamObjects.forEach((standing, index) => {
      if (standing.teamAcronym === losingTeamAcronym) {
        overtimeLosingTeamsIndex = index;
      }
    });
    arrayOfTeamObjects[overtimeLosingTeamsIndex].OTL++;
  }
}

export default incrementOvertimeLoss;
