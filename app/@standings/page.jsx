import Standings from "@/components/client/Standings";
import { getStandings } from "./(helpers)/get-standings";
import { getDivisionsAndConferences } from "./(helpers)/get-divisions-and-conferences";
import {
  DEFAULT_LEAGUE,
  MOST_RECENT_SEASON,
} from "@/utils/constants/constants";
import { connectToDb } from "@/utils/database";

async function standingsPage() {
  await connectToDb();
  const standings = JSON.parse(
    await getStandings(DEFAULT_LEAGUE, MOST_RECENT_SEASON)
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
    />
  );
}

export default standingsPage;
