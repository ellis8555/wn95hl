// returns an object with all the data pertaining to the received .csv file
// of a single game state
// gameStats array is the master array holding .csv key/value pairs after parsing
// methods in ./game-state-helper-methods extract information in an organized
// fashion from the .csv file

import extractGoalData from "./game-state-helper-methods/extract-goal-data";
import extractHomeTeamData from "./game-state-helper-methods/extract-home-team-data";
import extractAwayTeamData from "./game-state-helper-methods/extract-away-team-data";
import extractAwayPlayerStats from "./game-state-helper-methods/extract-away-player-stats";
import extractHomePlayerStats from "./game-state-helper-methods/extract-home-player-stats";
import extractAwayGoalieStats from "./game-state-helper-methods/extract-away-goalie-stats";
import extractHomeGoalieStats from "./game-state-helper-methods/extract-home-goalie-stats";
import extractPenaltyData from "./game-state-helper-methods/extract-penalty-data";
import extractOtherGameStats from "./game-state-helper-methods/extract-other-game-stats";

async function readGameStateFile(file, seasonNumber, gameType, leagueName) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    let gameProperties = {};

    reader.onload = (e) => {
      const fileContent = e.target.result;

      try {
        // get game stat categories
        const lines = fileContent.split("\n");
        const rows = lines[0].split("\r");
        const gameDataCategories = rows[0].split(",");
        // .csv file incorrectly has named home goals as away goals so edit required
        gameDataCategories[35] = "HomeGOALS";

        // get the values of game stat categorie
        const lines1 = fileContent.split("\n").slice(1);
        const rows1 = lines1[0].split("\r");
        const gameData = rows1[0].split(",");

        // combine categories and values into array of arrays
        // where each array item is an array of a key value pair of game stats
        let gameStats = [];
        for (let i = 0; i < gameDataCategories.length; i++) {
          gameStats.push([gameDataCategories[i], gameData[i]]);
        }
        const lengthOfGameStats = gameStats.length;

        //////////////////////////////////
        // begin organizing the games data
        //////////////////////////////////

        // gameStats contains array of key value pairs for all game data used in following methods
        // lengthOfGameStats is var holding gameStats length

        let GAME_DATA = {};

        // get home team stats
        GAME_DATA["homeTeamGameStats"] = extractHomeTeamData(gameStats);

        // get home team player stats
        GAME_DATA["homeTeamPlayerStats"] = extractHomePlayerStats(gameStats);

        // get home team player stats
        GAME_DATA["homeTeamGoalieStats"] = extractHomeGoalieStats(gameStats);

        // get away team stats
        GAME_DATA["awayTeamGameStats"] = extractAwayTeamData(gameStats);

        // get away team player stats
        GAME_DATA["awayTeamPlayerStats"] = extractAwayPlayerStats(gameStats);

        // get away team player stats
        GAME_DATA["awayTeamGoalieStats"] = extractAwayGoalieStats(gameStats);

        // get goal scoring data for each goal scored
        GAME_DATA["allGoalsScored"] = extractGoalData(
          gameStats,
          lengthOfGameStats
        );

        // get penalty data for each penalty taken
        GAME_DATA["allPenalties"] = extractPenaltyData(
          gameStats,
          lengthOfGameStats
        );

        // get other game stats.
        GAME_DATA["otherGameStats"] = extractOtherGameStats(
          gameStats,
          seasonNumber,
          gameType,
          leagueName
        );

        ////////////////////////////////////////
        // object containing all the games data
        ////////////////////////////////////////
        gameProperties = {
          currSeason: seasonNumber,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          data: GAME_DATA,
        };
        resolve(gameProperties);
      } catch (error) {
        gameProperties = {
          data: "There was an error processing the file",
        };
        reject(gameProperties);
      }
    };

    reader.onerror = (error) => {
      reject({
        message: "Error reading the file",
        error,
      });
    };

    reader.readAsBinaryString(file);
  });
}

export default readGameStateFile;
