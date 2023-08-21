import readGoalieAttributes from "./read-game-state-helpers/read-goalie-attributes";
import readSkatersAttributes from "./read-game-state-helpers/read-skater-attributes";
import readTeamPositionCounts from "./read-game-state-helpers/read-team-position-counts";

async function readBinaryGameState(file, seasonNumber, gameType, leagueName) {
  const goalieDict = await readGoalieAttributes();
  const skaterDict = await readSkatersAttributes();
  const teamPositionNumbersDict = await readTeamPositionCounts();

  const reader = new FileReader();
  let gameProperties = {};

  reader.onload = (e) => {
    const d = new Uint8Array(e.target.result);
    try {
      const teamCodesDict = {
        0: "AHC",
        1: "AUT",
        2: "BAY",
        3: "CDA",
        4: "DIN",
        5: "HAM",
        6: "HIG",
        7: "HOT",
        8: "SPG",
        9: "ITA",
        10: "MHA",
        11: "MHT",
        12: "MGG",
        13: "NBK",
        14: "OCW",
        15: "PIT",
        16: "PRO",
        17: "REN",
        18: "RIC",
        19: "ROM",
        20: "SAG",
        21: "SDM",
        22: "KVK",
        23: "SOV",
        24: "SVF",
        25: "SUM",
        26: "SUN",
        27: "TAI",
        28: "TBP",
        29: "IVF",
        30: "THT",
        31: "UGA",
      };

      // #Team stats

      // #Newer versions of RetroArch and Genesis Plus GX start the data 32 bytes
      // #later than older versions (for which this code was originally written)
      const offset = 32;

      // Away
      const awayGoals = d[50682 + offset];
      const awayPPGoals = d[50672 + offset];
      const awayPPTries = d[50674 + offset];
      const awayPPTime1 = d[51522 + offset];
      const awayPPTime2 = d[51523 + offset] * 256;
      const awayPPTime = awayPPTime1 + awayPPTime2;
      const awayPPShots = d[51524 + offset];
      const awaySHGoals = d[51526 + offset];
      const awaySHGoalsAgainst = d[50656 + offset];
      const awayBreakGoals = d[51530 + offset];
      const awayBreakTries = d[51528 + offset];
      const awayOneTimerGoals = d[51534 + offset];
      const awayOneTimerTries = d[51532 + offset];
      const awayPenShotGoals = d[51538 + offset];
      const awayPenShotTries = d[51536 + offset];
      const awayFaceoffWins = d[50684 + offset];
      const awayChecks = d[50686 + offset];
      const awayPenalties = d[50676 + offset];
      const awayPIM = d[50678 + offset];
      const awayAttackZoneTime1 = d[50680 + offset];
      const awayAttackZoneTime2 = d[50681 + offset] * 256;
      const awayAttackZoneTime = awayAttackZoneTime1 + awayAttackZoneTime2;
      const awayPassComps = d[50690 + offset];
      let awayPassTries = d[50688 + offset];

      //   #Adjust pass tries because if they're higher than 255, they show up as the
      //   #total minus 255

      if (awayPassTries < awayPassComps) {
        awayPassTries += 256;
      }

      const awayGoalsP1 = d[51506 + offset];
      const awayGoalsP2 = d[51508 + offset];
      const awayGoalsP3 = d[51510 + offset];
      const awayGoalsOT = d[51512 + offset];
      const awayShotsP1 = d[51514 + offset];
      const awayShotsP2 = d[51516 + offset];
      const awayShotsP3 = d[51518 + offset];
      const awayShotsOT = d[51520 + offset];
      const awayTeam = teamCodesDict[d[48982 + offset]];

      const awayShots = awayShotsP1 + awayShotsP2 + awayShotsP3 + awayShotsOT;
      let awayShootPct;

      try {
        awayShootPct = (awayGoals / awayShots).toFixed(3);
      } catch (error) {
        awayShootPct = 0;
      }

      // Home
      const homeGoals = d[49812 + offset];
      const homePPGoals = d[49802 + offset];
      const homePPTries = d[49804 + offset];
      const homePPTime1 = d[50652 + offset];
      const homePPTime2 = d[50653 + offset] * 256;
      const homePPTime = homePPTime1 + homePPTime2;
      const homePPShots = d[50654 + offset];
      const homeSHGoals = d[50656 + offset];
      const homeSHGoalsAgainst = d[51526 + offset];
      const homeBreakGoals = d[50660 + offset];
      const homeBreakTries = d[50658 + offset];
      const homeOneTimerGoals = d[50664 + offset];
      const homeOneTimerTries = d[50662 + offset];
      const homePenShotGoals = d[50668 + offset];
      const homePenShotTries = d[50666 + offset];
      const homeFaceoffWins = d[49814 + offset];
      const homeChecks = d[49816 + offset];
      const homePenalties = d[49806 + offset];
      const homePIM = d[49808 + offset];
      const homeAttackZoneTime1 = d[49810 + offset];
      const homeAttackZoneTime2 = d[49811 + offset] * 256;
      const homeAttackZoneTime = homeAttackZoneTime1 + homeAttackZoneTime2;
      const homePassComps = d[49820 + offset];
      let homePassTries = d[49818 + offset];

      //   #Adjust pass tries because if they're higher than 255, they show up as the
      //   #total minus 255

      if (homePassTries < homePassComps) {
        homePassTries += 256;
      }

      const homeGoalsP1 = d[50636 + offset];
      const homeGoalsP2 = d[50638 + offset];
      const homeGoalsP3 = d[50640 + offset];
      const homeGoalsOT = d[50642 + offset];
      const homeShotsP1 = d[50644 + offset];
      const homeShotsP2 = d[50646 + offset];
      const homeShotsP3 = d[50648 + offset];
      const homeShotsOT = d[50650 + offset];
      const homeTeam = teamCodesDict[d[48980 + offset]];

      const homeShots = homeShotsP1 + homeShotsP2 + homeShotsP3 + homeShotsOT;
      let homeShootPct;

      try {
        homeShootPct = (homeGoals / homeShots).toFixed(3);
      } catch (error) {
        homeShootPct = 0;
      }

      const faceoffTotal = awayFaceoffWins + homeFaceoffWins;

      //   #Get the roster information
      const awayGCount = +teamPositionNumbersDict[awayTeam]["goalies"];
      const awayFCount = +teamPositionNumbersDict[awayTeam]["forwards"];
      const awayDCount = +teamPositionNumbersDict[awayTeam]["defensemen"];

      const homeGCount = +teamPositionNumbersDict[homeTeam]["goalies"];
      const homeFCount = +teamPositionNumbersDict[homeTeam]["forwards"];
      const homeDCount = +teamPositionNumbersDict[homeTeam]["defensemen"];

      // #Prepare the lists for the away and home player stats
      const awayPlayerStats = Array.from(
        { length: awayGCount + awayFCount + awayDCount },
        () => []
      );

      // Extract the away player roster
      const awayPlayers = [
        ...goalieDict[awayTeam].map((item) => [item]),
        ...skaterDict[awayTeam].map((item) => [item]),
      ];

      // Add each player's position to each player's list
      for (let i = 0; i < awayGCount; i++) {
        awayPlayers[i].push("G");
      }

      for (let i = awayGCount; i < awayGCount + awayFCount; i++) {
        awayPlayers[i].push("F");
      }

      for (
        let i = awayGCount + awayFCount;
        i < awayGCount + awayFCount + awayDCount;
        i++
      ) {
        awayPlayers[i].push("D");
      }

      // Prepare the lists for the home player stats
      const homePlayerStats = Array.from(
        { length: homeGCount + homeFCount + homeDCount },
        () => []
      );

      // Extract the home player roster
      const homePlayers = [
        ...goalieDict[homeTeam].map((item) => [item]),
        ...skaterDict[homeTeam].map((item) => [item]),
      ];

      // Add each player's position to each player's list
      for (let i = 0; i < homeGCount; i++) {
        homePlayers[i].push("G");
      }

      for (let i = homeGCount; i < homeGCount + homeFCount; i++) {
        homePlayers[i].push("F");
      }

      for (
        let i = homeGCount + homeFCount;
        i < homeGCount + homeFCount + homeDCount;
        i++
      ) {
        homePlayers[i].push("D");
      }

      // Extract the goal summary
      console.log(homePlayers);

      /////////////////////////////
      // end of processing
      /////////////////////////////
    } catch (error) {
      console.log("inside of read binary file error has occured");
      console.log(error);
    }
  };
  reader.readAsArrayBuffer(file);
}

export default readBinaryGameState;
