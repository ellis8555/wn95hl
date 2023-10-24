import Standings from "@/components/client/Standings";
import {
  DEFAULT_LEAGUE,
  MOST_RECENT_SEASON,
} from "@/utils/constants/constants";
import {
  READ_SEASON_FIELD_DATA,
  READ_SEASON_STANDINGS,
} from "@/utils/constants/api_consts";
import { connectToDb } from "@/utils/database";

export const revalidate = 10;

async function getStandings(leagueName, seasonNumber) {
  const standings = await READ_SEASON_STANDINGS(leagueName, seasonNumber);

  return JSON.stringify(standings);
}

async function getDivisionsAndConferences(leagueName, seasonNumber) {
  const { divisionsAndConferences } = await READ_SEASON_FIELD_DATA(
    leagueName,
    seasonNumber,
    "teams-conferences-and-divisions"
  );
  return JSON.stringify(divisionsAndConferences);
}

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
