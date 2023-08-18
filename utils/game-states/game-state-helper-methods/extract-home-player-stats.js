function extractHomePlayerStats(gameData) {
  // home players are from indexs 232-341

  // get indexes for all home players
  const extractPlayerIndexes = [];
  for (let i = 232; i <= 341; i++) {
    if (gameData[i][0] === "Name") {
      extractPlayerIndexes.push(i);
    }
  }
  const playerCount = extractPlayerIndexes.length;
  // put each players stats into an array
  const allHomePlayerStats = [];
  for (let i = 0; i < playerCount; i++) {
    let playerDetails = {};
    const beginningIndex = extractPlayerIndexes[i];
    const endingIndex = beginningIndex + 10;
    for (let j = beginningIndex; j <= endingIndex; j++) {
      playerDetails[gameData[j][0]] = gameData[j][1];
    }
    allHomePlayerStats.push(playerDetails);
  }
  return allHomePlayerStats;
}

export default extractHomePlayerStats;
