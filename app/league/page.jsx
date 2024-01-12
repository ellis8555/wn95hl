import Standings from "@/components/client/Standings";
import { getStandings } from "./(helpers)/get-standings";
import { getDivisionsAndConferences } from "./(helpers)/get-divisions-and-conferences";
import { getConferences } from "./(helpers)/get-conferences";
import {
  DEFAULT_LEAGUE,
  MOST_RECENT_SEASON,
} from "@/utils/constants/constants";
import { connectToDb } from "@/utils/database";

const dbCallFrom = "league";

async function standingsPage() {
  await connectToDb(dbCallFrom);
  const standings = JSON.parse(
    await getStandings(DEFAULT_LEAGUE, MOST_RECENT_SEASON)
  );
  // get leagues conferences
  const getLeaguesConferences = JSON.parse(
    await getConferences(DEFAULT_LEAGUE, MOST_RECENT_SEASON)
  );
  const divisionsAndConferences = JSON.parse(
    await getDivisionsAndConferences(DEFAULT_LEAGUE, MOST_RECENT_SEASON)
  );
  return (
    <Standings
      leagueName={DEFAULT_LEAGUE}
      seasonNumber={MOST_RECENT_SEASON}
      leagueTable={standings}
      leagueStructure={divisionsAndConferences}
      conferences={getLeaguesConferences}
    />
  );
}

export default standingsPage;
