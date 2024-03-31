// increments the shutouts if team played a shutout
function updateTeamsShutouts(
    arrayOfTeamObjects,
    teamsIndex,
  ) {
    arrayOfTeamObjects[teamsIndex]["SO"]++
  }
  
  export default updateTeamsShutouts;