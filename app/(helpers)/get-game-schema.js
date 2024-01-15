async function getGameSchema(leagueName) {
  let GameSchema;
  switch (leagueName) {
    case "w":
      GameSchema = (await import("@/schemas/games/w_games")).default;
      break;
    default:
      GameSchema = (await import("@/schemas/games/w_games")).default;
  }
  return GameSchema;
}

export default getGameSchema;
