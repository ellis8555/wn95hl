import Standings from "@/components/client/Standings";
import { getStandings } from "../(helpers)/get-standings";
import { getDivisionsAndConferences } from "../(helpers)/get-divisions-and-conferences";
import { connectToDb } from "@/utils/database";

async function standingsPage({ params }) {
  // get league name from url param
  const leagueName = params["league-name"];
  // set the correct leagues schema to the matching league param
  let LeagueSchema;
  switch (leagueName) {
    case "w":
      LeagueSchema = (await import("@/schemas/season/w_season")).default;
      break;
    default:
      LeagueSchema = (await import("@/schemas/season/w_season")).default;
  }
  await connectToDb();
  // get the most recent season number for the league
  const getMostRecentSeason = await LeagueSchema.getMostRecentSeasonNumber();
  // get the leagues standings
  const standings = JSON.parse(
    await getStandings(leagueName, getMostRecentSeason)
  );
  // get the leagues conferences and divisions
  const divisionsAndConferences = JSON.parse(
    await getDivisionsAndConferences(leagueName, getMostRecentSeason)
  );
  return (
    <Standings
      leagueName={leagueName}
      seasonNumber={getMostRecentSeason}
      leagueTable={standings}
      leagueStructure={divisionsAndConferences}
    />
  );
}

export default standingsPage;
