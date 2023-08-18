function extractHomeGoalieStats(gameData) {
  // home players are from indexs 202-231

  // get indexes the away goalies
  const extractPlayerIndexes = [];
  for (let i = 202; i <= 231; i++) {
    if (gameData[i][0] === "Name") {
      extractPlayerIndexes.push(i);
    }
  }
  const playerCount = extractPlayerIndexes.length;
  // put each goalies stats into an array
  const allHomeGoalieStats = [];
  for (let i = 0; i < playerCount; i++) {
    let goalieDetails = {};
    const beginningIndex = extractPlayerIndexes[i];
    const endingIndex = beginningIndex + 14;
    for (let j = beginningIndex; j <= endingIndex; j++) {
      goalieDetails[gameData[j][0]] = gameData[j][1];
    }
    allHomeGoalieStats.push(goalieDetails);
  }
  return allHomeGoalieStats;
}

export default extractHomeGoalieStats;
