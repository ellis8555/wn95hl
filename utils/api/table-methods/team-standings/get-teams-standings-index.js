// gets the index where a team is located in an array
// objects that contain teams' wins, losses, ties, etc...

function getTeamsStandingsIndex(arrayOfTeamObjects, teamAcronym) {
  let indexNumber;
  arrayOfTeamObjects.forEach((team, index) => {
    if (team.teamAcronym === teamAcronym) {
      indexNumber = index;
    }
  });
  return indexNumber;
}

export default getTeamsStandingsIndex;
