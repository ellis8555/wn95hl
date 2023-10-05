// gets the index where a team is located in an array
// objects that contain teams' wins, losses, ties, etc...

function getTeamsStandingsIndex(arrayOfTeamObjects, teamName) {
  let indexNumber;
  arrayOfTeamObjects.forEach((team, index) => {
    if (team.teamName === teamName) {
      indexNumber = index;
    }
  });
  return indexNumber;
}

export default getTeamsStandingsIndex;
