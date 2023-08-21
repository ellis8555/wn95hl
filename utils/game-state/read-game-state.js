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
      // #We could use the number of goals that we calculated earlier to do this, but
      // #to be safe, we'll extract the game's specific byte for telling us how many
      // #bytes long the scoring summary is.
      const numGoals = d[49196 + offset] / 6;

      // #Blank array of arrays to hold the scoring summary
      let scoringSummaryList = new Array(numGoals);

      // #Dictionary with information about different goal types
      const goalTypeDict = {
        0: "Home SH2",
        1: "Home SH",
        2: "Home EV",
        3: "Home PP",
        4: "Home PP2",
        128: "Away SH2",
        129: "Away SH",
        130: "Away EV",
        131: "Away PP",
        132: "Away PP2",
      };

      // Object with information about different goal types
      for (let i = 0; i < numGoals; i++) {
        scoringSummaryList[i] = [];
      }

      // #Each goal summary is 6 bytes long
      // #Format in the output list:
      // #Period number, seconds, team, status, goal scorer, assist 1, assist 2
      let startByte = 49198 + offset;
      for (let i = 0; i < numGoals; i++) {
        // Period number
        let perFactor;
        if (d[startByte + 1 + i * 6] < 64) {
          perFactor = 0;
        } else if (
          d[startByte + 1 + i * 6] >= 64 &&
          d[startByte + 1 + i * 6] < 128
        ) {
          perFactor = 64;
        } else if (
          d[startByte + 1 + i * 6] >= 128 &&
          d[startByte + 1 + i * 6] < 192
        ) {
          perFactor = 128;
        } else {
          perFactor = 192;
        }
        const periodNum = Math.floor(perFactor / 64) + 1;
        scoringSummaryList[i].push(periodNum);

        // Number of seconds into the current period
        const secondsNum =
          (parseInt(d[startByte + 1 + i * 6]) - perFactor) * 256 +
          parseInt(d[startByte + i * 6]);
        scoringSummaryList[i].push(secondsNum);

        // Team and type of goal
        const [goalTeam, goalStatus] =
          goalTypeDict[d[startByte + 3 + i * 6]].split(" ");
        scoringSummaryList[i].push(goalTeam);
        scoringSummaryList[i].push(goalStatus);

        // Goal scorer
        const scorerRosterSlot = d[startByte + 2 + i * 6];
        const scorerName =
          goalTeam === "Home"
            ? homePlayers[scorerRosterSlot][0]
            : awayPlayers[scorerRosterSlot][0];
        scoringSummaryList[i].push(scorerName);

        // Assist1 player
        const assist1RosterSlot = d[startByte + 5 + i * 6];
        const assist1Name =
          assist1RosterSlot === 255
            ? ""
            : goalTeam === "Home"
            ? homePlayers[assist1RosterSlot][0]
            : awayPlayers[assist1RosterSlot][0];
        scoringSummaryList[i].push(assist1Name);

        // Assist2 player
        const assist2RosterSlot = d[startByte + 4 + i * 6];
        const assist2Name =
          assist2RosterSlot === 255
            ? ""
            : goalTeam === "Home"
            ? homePlayers[assist2RosterSlot][0]
            : awayPlayers[assist2RosterSlot][0];
        scoringSummaryList[i].push(assist2Name);
      }

      // #Extract the penalty summary

      // #Extract the number of penalties
      const numPens = d[49558 + offset] / 4;

      const penaltySummaryList = new Array(numPens);

      for (let i = 0; i < numPens; i++) {
        penaltySummaryList[i] = [];
      }

      // #Dictionary to decode penalties by team and type
      const teamPenDict = {
        18: "Home Boarding",
        22: "Home Charging",
        24: "Home Slashing",
        26: "Home Roughing",
        28: "Home Cross-Checking",
        30: "Home Hooking",
        32: "Home Tripping",
        34: "Home Interference",
        36: "Home Holding",
        38: "Home Fighting",
        146: "Away Boarding",
        150: "Away Charging",
        152: "Away Slashing",
        154: "Away Roughing",
        156: "Away Cross-Checking",
        158: "Away Hooking",
        160: "Away Tripping",
        162: "Away Interference",
        164: "Away Holding",
        166: "Away Fighting",
      };

      // #Each penalty summary is 4 bytes long
      // #Format in the output list:
      // #Period number, seconds, team, type, player
      startByte = 49560 + offset;

      for (let i = 0; i < numPens; i++) {
        // Period number
        let perFactor;
        if (d[startByte + 1 + i * 4] < 64) {
          perFactor = 0;
        } else if (
          d[startByte + 1 + i * 4] >= 64 &&
          d[startByte + 1 + i * 4] < 128
        ) {
          perFactor = 64;
        } else if (
          d[startByte + 1 + i * 4] >= 128 &&
          d[startByte + 1 + i * 4] < 192
        ) {
          perFactor = 128;
        } else {
          perFactor = 192;
        }
        const periodNum = Math.floor(perFactor / 64) + 1;
        penaltySummaryList[i].push(periodNum);

        // Number of seconds into the current period
        const secondsNum =
          (parseInt(d[startByte + 1 + i * 4]) - perFactor) * 256 +
          parseInt(d[startByte + i * 4]);
        penaltySummaryList[i].push(secondsNum);

        // Team and type of penalty
        const [penTeam, penType] =
          teamPenDict[d[startByte + 3 + i * 4]].split(" ");
        penaltySummaryList[i].push(penTeam);
        penaltySummaryList[i].push(penType);

        // Player
        const playerRosterSlot = d[startByte + 2 + i * 4];
        const playerName =
          penTeam === "Home"
            ? homePlayers[playerRosterSlot][0]
            : awayPlayers[playerRosterSlot][0];
        penaltySummaryList[i].push(playerName);
      }

      // #Calculate the length of the game. This is useful because the TOI
      // #calculation occasionally outputs a TOI that's longer than the actual game.
      // #This way, we can at least trim TOIs that are longer than the game length.

      // #Calculate whether there was OT or not. There's no single byte that stores
      // #this info, so we'll infer this info from whether or not there were any OT
      // #goals or shots.
      let OT = 0; // Initialize OT flag to 0

      if (
        awayGoalsOT > 0 ||
        awayShotsOT > 0 ||
        homeGoalsOT > 0 ||
        homeShotsOT > 0
      ) {
        OT = 1;
      } else {
        try {
          if (penaltySummaryList[penaltySummaryList.length - 1][0] === 4) {
            OT = 1;
          } else {
            OT = 0;
          }
        } catch (error) {
          OT = 0;
        }
      }

      let gameLength;

      if (!OT) {
        gameLength = 900; // If there was no OT, game length is 900 seconds
      } else {
        if (homeGoals === awayGoals) {
          gameLength = 1200; // Full OT played if the game finished tied
        } else {
          const otLength = scoringSummaryList[scoringSummaryList.length - 1][1];
          gameLength = 900 + otLength; // Game length with added OT time
        }
      }

      // #Now extract the player stats for all skaters and goalies. We'll extract
      // #the same numbers for skaters and for goalies, treating them all as if they
      // #are skaters. Once that is done, we'll go back to the goalie stats and fix
      // #those.

      // #The reason for swapVal is that the goal/assist/whatever counts are arranged
      // #in the order 01 00 03 02 05 04 etc., and so the swapVal addition allows
      // #us to go through the players in roster order.
      let swapVal = 1;

      for (let i = 0; i < awayGCount + awayFCount + awayDCount; i++) {
        // Start in the right location in the save state
        let startByte = 50852 + offset;

        // Team
        awayPlayerStats[i].push(awayTeam);

        // Player Name
        awayPlayerStats[i].push(awayPlayers[i][0]);

        // Position
        awayPlayerStats[i].push(awayPlayers[i][1]);

        // Goals
        let byteJump = 0;
        awayPlayerStats[i].push(d[startByte + byteJump + i + swapVal]);

        // Assists
        byteJump = 26;
        awayPlayerStats[i].push(d[startByte + byteJump + i + swapVal]);

        // Points
        awayPlayerStats[i].push(awayPlayerStats[i][3] + awayPlayerStats[i][4]);

        // Shots on goal
        byteJump = 52;
        awayPlayerStats[i].push(d[startByte + byteJump + i + swapVal]);

        // Checks For
        byteJump = 104;
        awayPlayerStats[i].push(d[startByte + byteJump + i + swapVal]);

        // PIM
        byteJump = 78;
        awayPlayerStats[i].push(d[startByte + byteJump + i + swapVal]);

        // TOI
        byteJump = 130;
        const TOIMinutes = d[startByte + byteJump + 1 + i * 2] * 256;
        const TOISeconds = d[startByte + byteJump - 0 + i * 2];
        let TOI = TOIMinutes + TOISeconds;

        // Occasionally, TOI is higher than the length of the game because the game doesn't quite calculate it correctly all of the time.
        // If so, then we'll trim it to the length of the game
        TOI = Math.min(TOI, gameLength);

        awayPlayerStats[i].push(TOI);

        swapVal *= -1;
      }

      // #Clean up the goalie stats - keep position 3 (goals against), 4 (assists),
      // #6 (shots against), 9 (TOI)
      for (let i = 0; i < awayGCount; i++) {
        awayPlayerStats[i].splice(8, 1); // Remove element at index 8
        awayPlayerStats[i].splice(7, 1); // Remove element at index 7
        awayPlayerStats[i].splice(5, 1); // Remove element at index 5

        try {
          let shootingPercentage = (
            (awayPlayerStats[i][5] - awayPlayerStats[i][3]) /
            awayPlayerStats[i][5]
          ).toFixed(3);
          shootingPercentage = isNaN(shootingPercentage)
            ? 0.0
            : Number(shootingPercentage);
          awayPlayerStats[i].push(shootingPercentage);
        } catch (error) {
          awayPlayerStats[i].push(0.0);
        }
      }

      // #Now extract the player stats for all skaters and goalies. We'll extract
      // #the same numbers for skaters and for goalies, treating them all as if they
      // #are skaters. Once that is done, we'll go back to the goalie stats and fix
      // #those.

      // #The reason for swapVal is that the goal/assist/whatever counts are arranged
      // #in the order 01 00 03 02 05 04 etc., and so the swapVal addition allows
      // #us to go through the players in roster order.
      swapVal = 1;

      for (let i = 0; i < homeGCount + homeFCount + homeDCount; i++) {
        // Start in the right location in the save state
        startByte = 49982 + offset;

        // Team
        homePlayerStats[i].push(homeTeam);

        // Player Name
        homePlayerStats[i].push(homePlayers[i][0]);

        // Position
        homePlayerStats[i].push(homePlayers[i][1]);

        // Goals
        let byteJump = 0;
        homePlayerStats[i].push(d[startByte + byteJump + i + swapVal]);

        // Assists
        byteJump = 26;
        homePlayerStats[i].push(d[startByte + byteJump + i + swapVal]);

        // Points
        homePlayerStats[i].push(homePlayerStats[i][3] + homePlayerStats[i][4]);

        // Shots on goal
        byteJump = 52;
        homePlayerStats[i].push(d[startByte + byteJump + i + swapVal]);

        // Checks For
        byteJump = 104;
        homePlayerStats[i].push(d[startByte + byteJump + i + swapVal]);

        // PIM
        byteJump = 78;
        homePlayerStats[i].push(d[startByte + byteJump + i + swapVal]);

        // TOI
        byteJump = 130;
        const TOIMinutes = d[startByte + byteJump + 1 + i * 2] * 256;
        const TOISeconds = d[startByte + byteJump - 0 + i * 2];
        let TOI = TOIMinutes + TOISeconds;

        // Occasionally, TOI is higher than the length of the game because the game doesn't quite calculate it correctly all of the time.
        // If so, then we'll trim it to the length of the game
        TOI = Math.min(TOI, gameLength);

        homePlayerStats[i].push(TOI);

        swapVal *= -1;
      }

      // #Clean up the goalie stats - keep position 3 (goals against), 4 (assists),
      // #6 (shots against), 9 (TOI)
      for (let i = 0; i < homeGCount; i++) {
        homePlayerStats[i].splice(8, 1); // Remove element at index 8
        homePlayerStats[i].splice(7, 1); // Remove element at index 7
        homePlayerStats[i].splice(5, 1); // Remove element at index 5

        try {
          let shootingPercentage = (
            (homePlayerStats[i][5] - homePlayerStats[i][3]) /
            homePlayerStats[i][5]
          ).toFixed(3);
          shootingPercentage = isNaN(shootingPercentage)
            ? 0.0
            : Number(shootingPercentage);
          homePlayerStats[i].push(shootingPercentage);
        } catch (error) {
          homePlayerStats[i].push(0.0);
        }
      }

      // #Assemble all of the stats within a object
      const statsDict = {};

      statsDict["awayTeam"] = awayTeam;
      statsDict["awayGoals"] = awayGoals;
      statsDict["awayShots"] = awayShots;
      statsDict["awayShootPct"] = awayShootPct;
      statsDict["awayPPGoals"] = awayPPGoals;
      statsDict["awayPPTries"] = awayPPTries;
      statsDict["awayPPTime"] = `${Math.floor(awayPPTime / 60)}:${
        awayPPTime % 60 < 10 ? "0" : ""
      }${awayPPTime % 60}`;
      statsDict["awayPPShots"] = awayPPShots;
      statsDict["awaySHGoals"] = awaySHGoals;
      statsDict["awayBreakGoals"] = awayBreakGoals;
      statsDict["awayBreakTries"] = awayBreakTries;
      statsDict["awayOneTimerGoals"] = awayOneTimerGoals;
      statsDict["awayOneTimerTries"] = awayOneTimerTries;
      statsDict["awayPenShotGoals"] = awayPenShotGoals;
      statsDict["awayPenShotTries"] = awayPenShotTries;
      statsDict["awayFaceoffWins"] = awayFaceoffWins;
      statsDict["awayChecks"] = awayChecks;
      statsDict["awayPenalties"] = awayPenalties;
      statsDict["awayPIM"] = awayPIM;
      statsDict["awayAttackZoneTime"] = `${Math.floor(
        awayAttackZoneTime / 60
      )}:${awayAttackZoneTime % 60 < 10 ? "0" : ""}${awayAttackZoneTime % 60}`;
      statsDict["awayPassComps"] = awayPassComps;
      statsDict["awayPassTries"] = awayPassTries;
      statsDict["awayGoalsP1"] = awayGoalsP1;
      statsDict["awayGoalsP2"] = awayGoalsP2;
      statsDict["awayGoalsP3"] = awayGoalsP3;
      statsDict["awayGoalsOT"] = awayGoalsOT;
      statsDict["awayShotsP1"] = awayShotsP1;
      statsDict["awayShotsP2"] = awayShotsP2;
      statsDict["awayShotsP3"] = awayShotsP3;
      statsDict["awayShotsOT"] = awayShotsOT;

      statsDict["homeTeam"] = homeTeam;
      statsDict["homeGoals"] = homeGoals;
      statsDict["homeShots"] = homeShots;
      statsDict["homeShootPct"] = homeShootPct;
      statsDict["homePPGoals"] = homePPGoals;
      statsDict["homePPTries"] = homePPTries;
      statsDict["homePPTime"] = `${Math.floor(homePPTime / 60)}:${
        homePPTime % 60 < 10 ? "0" : ""
      }${homePPTime % 60}`;
      statsDict["homePPShots"] = homePPShots;
      statsDict["homeSHGoals"] = homeSHGoals;
      statsDict["homeBreakGoals"] = homeBreakGoals;
      statsDict["homeBreakTries"] = homeBreakTries;
      statsDict["homeOneTimerGoals"] = homeOneTimerGoals;
      statsDict["homeOneTimerTries"] = homeOneTimerTries;
      statsDict["homePenShotGoals"] = homePenShotGoals;
      statsDict["homePenShotTries"] = homePenShotTries;
      statsDict["homeFaceoffWins"] = homeFaceoffWins;
      statsDict["homeChecks"] = homeChecks;
      statsDict["homePenalties"] = homePenalties;
      statsDict["homePIM"] = homePIM;
      statsDict["homeAttackZoneTime"] = `${Math.floor(
        homeAttackZoneTime / 60
      )}:${homeAttackZoneTime % 60 < 10 ? "0" : ""}${homeAttackZoneTime % 60}`;
      statsDict["homePassComps"] = homePassComps;
      statsDict["homePassTries"] = homePassTries;
      statsDict["homeGoalsP1"] = homeGoalsP1;
      statsDict["homeGoalsP2"] = homeGoalsP2;
      statsDict["homeGoalsP3"] = homeGoalsP3;
      statsDict["homeGoalsOT"] = homeGoalsOT;
      statsDict["homeShotsP1"] = homeShotsP1;
      statsDict["homeShotsP2"] = homeShotsP2;
      statsDict["homeShotsP3"] = homeShotsP3;
      statsDict["homeShotsOT"] = homeShotsOT;

      statsDict["matchup"] = `${awayTeam}/${homeTeam}`;
      statsDict["totalFaceoffs"] = awayFaceoffWins + homeFaceoffWins;
      statsDict["OT"] = OT;
      statsDict["gameLength"] = `${Math.floor(gameLength / 60)}:${
        gameLength % 60 < 10 ? "0" : ""
      }${gameLength % 60}`;

      // #Home player stats

      // #Home goalie stats

      // #Start by figuring out which goalie is the goalie of record (greater
      // #TOI)
      let recGoalie;
      if (homePlayerStats[0][6] >= homePlayerStats[1][6]) {
        recGoalie = 0;
      } else {
        recGoalie = 1;
      }

      for (let i = 0; i < 2; i++) {
        // Check whether the goalie scored any goals
        const goalieName = homePlayerStats[i][1];
        let goalieGoalCount = 0;
        for (let goal of scoringSummaryList) {
          if (goal[4] === goalieName) {
            goalieGoalCount++;
          }
        }

        // Calculate the goalie's W/L/T/OTL info
        let W, L, T, OTL;
        if (recGoalie === i) {
          W = homeGoals > awayGoals ? 1 : 0;
          L = homeGoals < awayGoals && statsDict["OT"] === 0 ? 1 : 0;
          T = homeGoals === awayGoals ? 1 : 0;
          OTL = homeGoals < awayGoals && statsDict["OT"] === 1 ? 1 : 0;
        } else {
          W = 0;
          L = 0;
          T = 0;
          OTL = 0;
        }

        // Create the goalie's stats object
        statsDict[`homeGoalie${i + 1}`] = {
          name: goalieName,
          pos: homePlayerStats[i][2],
          goals: goalieGoalCount,
          assists: homePlayerStats[i][4],
          points: goalieGoalCount + homePlayerStats[i][4],
          SO: homePlayerStats[i][3] === 0 && recGoalie === i ? 1 : 0,
          GA: homePlayerStats[i][3],
          saves: homePlayerStats[i][5] - homePlayerStats[i][3],
          shots: homePlayerStats[i][5],
          savePct: homePlayerStats[i][7],
          W: W,
          L: L,
          T: T,
          OTL: OTL,
          TOI: `${Math.floor(homePlayerStats[i][6] / 60)}:${
            homePlayerStats[i][6] % 60 < 10 ? "0" : ""
          }${homePlayerStats[i][6] % 60}`,
        };
      }

      // #Home skater stats
      for (let i = 2; i < 12; i++) {
        const skaterName = homePlayerStats[i][1];

        // Calculate how many power play and shorthanded points the player has
        let playerPPP = 0;
        let playerSHP = 0;

        for (let goal of scoringSummaryList) {
          if (
            goal[3].substring(0, 2) === "PP" &&
            [goal[4], goal[5], goal[6]].includes(skaterName)
          ) {
            playerPPP++;
          } else if (
            goal[3].substring(0, 2) === "SH" &&
            [goal[4], goal[5], goal[6]].includes(skaterName)
          ) {
            playerSHP++;
          }
        }

        // Create the skater's stats object
        statsDict[`homeSkater${i - 1}`] = {
          name: skaterName,
          pos: homePlayerStats[i][2],
          goals: homePlayerStats[i][3],
          assists: homePlayerStats[i][4],
          points: homePlayerStats[i][5],
          SOG: homePlayerStats[i][6],
          checks: homePlayerStats[i][7],
          PIM: homePlayerStats[i][8],
          PPP: playerPPP,
          SHP: playerSHP,
          TOI: `${Math.floor(homePlayerStats[i][9] / 60)}:${
            homePlayerStats[i][9] % 60 < 10 ? "0" : ""
          }${homePlayerStats[i][9] % 60}`,
        };
      }

      // #Away player stats

      // #Away goalie stats

      // #Start by figuring out which goalie is the goalie of record (greater
      // #TOI)
      recGoalie;
      if (awayPlayerStats[0][6] >= awayPlayerStats[1][6]) {
        recGoalie = 0;
      } else {
        recGoalie = 1;
      }

      for (let i = 0; i < 2; i++) {
        // Check whether the goalie scored any goals
        const goalieName = awayPlayerStats[i][1];
        let goalieGoalCount = 0;
        for (let goal of scoringSummaryList) {
          if (goal[4] === goalieName) {
            goalieGoalCount++;
          }
        }

        // Calculate the goalie's W/L/T/OTL info
        let W, L, T, OTL;
        if (recGoalie === i) {
          W = awayGoals > homeGoals ? 1 : 0;
          L = awayGoals < homeGoals && statsDict["OT"] === 0 ? 1 : 0;
          T = awayGoals === homeGoals ? 1 : 0;
          OTL = awayGoals < homeGoals && statsDict["OT"] === 1 ? 1 : 0;
        } else {
          W = 0;
          L = 0;
          T = 0;
          OTL = 0;
        }

        // Create the goalie's stats object
        statsDict[`awayGoalie${i + 1}`] = {
          name: goalieName,
          pos: awayPlayerStats[i][2],
          goals: goalieGoalCount,
          assists: awayPlayerStats[i][4],
          points: goalieGoalCount + awayPlayerStats[i][4],
          SO: awayPlayerStats[i][3] === 0 && recGoalie === i ? 1 : 0,
          GA: awayPlayerStats[i][3],
          saves: awayPlayerStats[i][5] - awayPlayerStats[i][3],
          shots: awayPlayerStats[i][5],
          savePct: awayPlayerStats[i][7],
          W: W,
          L: L,
          T: T,
          OTL: OTL,
          TOI: `${Math.floor(awayPlayerStats[i][6] / 60)}:${
            awayPlayerStats[i][6] % 60 < 10 ? "0" : ""
          }${awayPlayerStats[i][6] % 60}`,
        };
      }

      for (let i = 2; i < 12; i++) {
        const skaterName = awayPlayerStats[i][1];

        // Calculate how many power play and shorthanded points the player has
        let playerPPP = 0;
        let playerSHP = 0;

        for (let goal of scoringSummaryList) {
          if (
            goal[3].substring(0, 2) === "PP" &&
            [goal[4], goal[5], goal[6]].includes(skaterName)
          ) {
            playerPPP++;
          } else if (
            goal[3].substring(0, 2) === "SH" &&
            [goal[4], goal[5], goal[6]].includes(skaterName)
          ) {
            playerSHP++;
          }
        }

        // Create the skater's stats object
        statsDict[`awaySkater${i - 1}`] = {
          name: skaterName,
          pos: awayPlayerStats[i][2],
          goals: awayPlayerStats[i][3],
          assists: awayPlayerStats[i][4],
          points: awayPlayerStats[i][5],
          SOG: awayPlayerStats[i][6],
          checks: awayPlayerStats[i][7],
          PIM: awayPlayerStats[i][8],
          PPP: playerPPP,
          SHP: playerSHP,
          TOI: `${Math.floor(awayPlayerStats[i][9] / 60)}:${
            awayPlayerStats[i][9] % 60 < 10 ? "0" : ""
          }${awayPlayerStats[i][9] % 60}`,
        };
      }

      // Initialize an array to store the goal objects
      const goalObjects = [];

      // Loop through the first 15 goals (or fewer if there aren't that many)
      for (let i = 0; i < 15; i++) {
        // Determine whether it's a legitimate goal or not
        if (i < scoringSummaryList.length) {
          // Goal #, Period, Time, Team, Scorer, Assist 1, Assist 2
          const goal = scoringSummaryList[i];
          const goalObj = {
            goalNum: i + 1,
            period: goal[0],
            // Format the time as a string
            time: `${Math.floor(goal[1] / 60)}:${goal[1] % 60 < 10 ? "0" : ""}${
              goal[1] % 60
            }`,
            team: goal[2] === "Home" ? homeTeam : awayTeam,
            scorer: goal[4],
            assist1: goal[5],
            assist2: goal[6],
            type: goal[3],
          };
          goalObjects.push(goalObj);
        } else {
          // Fill in placeholder values
          goalObjects.push({
            goalNum: "-",
            period: "-",
            time: "-",
            team: "-",
            scorer: "-",
            assist1: "-",
            assist2: "-",
            type: "-",
          });
        }
      }

      // Create properties in statsDict for each goal object
      for (let i = 0; i < goalObjects.length; i++) {
        statsDict[`Goal${i + 1}`] = goalObjects[i];
      }

      // Initialize an array to store the penalty objects
      const penaltyObjects = [];

      // Loop through the first 15 penalties (or fewer if there aren't that many)
      for (let i = 0; i < 15; i++) {
        // Determine whether it's a legitimate penalty or not
        if (i < penaltySummaryList.length) {
          // Pen #, Period, Time, Team, Player, Type
          const penalty = penaltySummaryList[i];
          const penaltyObj = {
            penNum: i + 1,
            period: penalty[0],
            // Format the time as a string
            time: `${Math.floor(penalty[1] / 60)}:${
              penalty[1] % 60 < 10 ? "0" : ""
            }${penalty[1] % 60}`,
            team: penalty[2] === "Home" ? homeTeam : awayTeam,
            player: penalty[4],
            type: penalty[3],
          };
          penaltyObjects.push(penaltyObj);
        } else {
          // Fill in placeholder values
          penaltyObjects.push({
            penNum: "-",
            period: "-",
            time: "-",
            team: "-",
            player: "-",
            type: "-",
          });
        }
      }

      // Create properties in statsDict for each penalty object
      for (let i = 0; i < penaltyObjects.length; i++) {
        statsDict[`Penalty${i + 1}`] = penaltyObjects[i];
      }

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
