import Standings from "@/components/client/Standings";
import getLeagueSchema from "@/app/(helpers)/get-league-schema";
import { getStandings } from "../(helpers)/get-standings";
import { getDivisionsAndConferences } from "../(helpers)/get-divisions-and-conferences";
import { getConferences } from "../(helpers)/get-conferences";
import { connectToDb } from "@/utils/database";

const dbCallFrom = "league/[league-name]";

async function standingsPage({ params }) {
  // get league name from url param
  const leagueName = params["league-name"];
  // set the correct leagues schema to the matching league param
  await connectToDb(dbCallFrom);
  const LeagueSchema = await getLeagueSchema(leagueName);
  // get the most recent season number for the league
  const getMostRecentSeason = await LeagueSchema.getMostRecentSeasonNumber();
  // get leagues conferences
  const getLeaguesConferences = JSON.parse(
    await getConferences(leagueName, getMostRecentSeason)
  );
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
      conferences={getLeaguesConferences}
    />
  );
}

export default standingsPage;
