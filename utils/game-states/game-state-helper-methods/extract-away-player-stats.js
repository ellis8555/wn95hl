function extractAwayPlayerStats(gameData) {
  // away players are from indexs 92-201

  // get indexes away players
  const extractPlayerIndexes = [];
  for (let i = 92; i <= 201; i++) {
    if (gameData[i][0] === "Name") {
      extractPlayerIndexes.push(i);
    }
  }
  const playerCount = extractPlayerIndexes.length;
  // put each players stats into an array
  const allAwayPlayerStats = [];
  for (let i = 0; i < playerCount; i++) {
    let playerDetails = {};
    const beginningIndex = extractPlayerIndexes[i];
    const endingIndex = beginningIndex + 10;
    for (let j = beginningIndex; j <= endingIndex; j++) {
      playerDetails[gameData[j][0]] = gameData[j][1];
    }
    allAwayPlayerStats.push(playerDetails);
  }
  return allAwayPlayerStats;
}

export default extractAwayPlayerStats;
