// adjust a teams streak in the 'strk' column

function setCurrentTeamStreak(
    arrayOfTeamObjects,
    teamStandingsIndex,
    teamsPointsFromGame,
    wasGameATie,
  ) {
      const teamsCurrentStreak = arrayOfTeamObjects[teamStandingsIndex].Strk || "-";

      // if first game of season simply set the streak to 1 plus the result
      if(teamsCurrentStreak === "-" || isNaN(teamsCurrentStreak) || teamsCurrentStreak == undefined){
        let streakLength;
        let streakType;
        streakLength = 1;
        if(teamsPointsFromGame === 2){
            streakType = "W"
        }
        if(teamsPointsFromGame === 0){
            streakType = "L"
        }
        if(teamsPointsFromGame === 1 && !wasGameATie){
            streakType = "L"
        }
        if(teamsPointsFromGame === 1 && wasGameATie){
            streakType = "T"
        }
        arrayOfTeamObjects[teamStandingsIndex].Strk = streakLength.toString() + streakType;
    }

        // if team has played at least one game of the season and has a streak set
        
        // get the length of the streak to determine if streak is 10 or greater of a type
        const lengthOfStreakString = teamsCurrentStreak.length;
        if(lengthOfStreakString > 1){
            let previousStreakLength;
            let previousStreakType;
            let updatedStreakLength;
            let updatedStreaktype;
            //extract streakLength and streak type from previously set streak
            // if streak is single digit
            if(lengthOfStreakString === 2){
                previousStreakLength = teamsCurrentStreak.charAt(0);
                previousStreakType = teamsCurrentStreak.charAt(1)
            }
            // if streak is in double digits
            if(lengthOfStreakString === 3){
                previousStreakLength = teamsCurrentStreak.charAt(0) + teamsCurrentStreak.charAt(1)
                previousStreakType = teamsCurrentStreak.charAt(2)
            }
            // begin setting new streak strings
            if(teamsPointsFromGame === 2){
                if(previousStreakType === "W"){
                    updatedStreakLength = +previousStreakLength + 1
                } else {
                    updatedStreakLength = 1
                }
                updatedStreaktype = "W"
            }
            if(teamsPointsFromGame === 0){
                if(previousStreakType === "L"){
                    updatedStreakLength = +previousStreakLength + 1
                } else {
                    updatedStreakLength = 1
                }
                updatedStreaktype = "L"
            }
            if(teamsPointsFromGame === 1 && !wasGameATie){
                if(previousStreakType === "L"){
                    updatedStreakLength = +previousStreakLength + 1
                } else {
                    updatedStreakLength = 1
                }
                updatedStreaktype = "L"
            }
            if(teamsPointsFromGame === 1 && wasGameATie){
                if(previousStreakType === "T"){
                    updatedStreakLength = +previousStreakLength + 1
                } else {
                    updatedStreakLength = 1
                }
                updatedStreaktype = "T"
            }
            arrayOfTeamObjects[teamStandingsIndex].Strk = updatedStreakLength.toString() + updatedStreaktype;
        }
    }

  
  export default setCurrentTeamStreak;