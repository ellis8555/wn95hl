import Standings from "@/components/client/Standings";
import { getStandings } from "../../(helpers)/get-standings";
import { getDivisionsAndConferences } from "../../(helpers)/get-divisions-and-conferences";
import { getConferences } from "../../(helpers)/get-conferences";
import { connectToDb } from "@/utils/database";

const dbCallFrom = "league/[league-name]";

async function standingsPage({ params }) {
  // get league name from url param
  const leagueName = params["league-name"];
  // get season number from url param
  const seasonNumber = params["season-number"];
  // set the correct leagues schema to the matching league param
  await connectToDb(dbCallFrom);
  // get leagues conferences
  const getLeaguesConferences = JSON.parse(
    await getConferences(leagueName, seasonNumber)
  );
  // get the leagues standings
  const standings = JSON.parse(await getStandings(leagueName, seasonNumber));
  // get the leagues conferences and divisions
  const divisionsAndConferences = JSON.parse(
    await getDivisionsAndConferences(leagueName, seasonNumber)
  );
  return (
    <Standings
      leagueName={leagueName}
      seasonNumber={seasonNumber}
      leagueTable={standings}
      leagueStructure={divisionsAndConferences}
      conferences={getLeaguesConferences}
    />
  );
}

export default standingsPage;
