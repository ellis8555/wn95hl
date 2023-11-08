async function getLeagueSchema(leagueName) {
  let LeagueSchema;
  switch (leagueName) {
    case "w":
      LeagueSchema = (await import("@/schemas/season/w_season")).default;
      break;
    default:
      LeagueSchema = (await import("@/schemas/season/w_season")).default;
  }
  return LeagueSchema;
}

export default getLeagueSchema;
