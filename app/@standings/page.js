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

export const dynamic = "force-dynamic";

async function getStandings(leagueName, seasonNumber) {
  await connectToDb();

  const responseData = {};

  responseData.standings = await READ_SEASON_STANDINGS(
    leagueName,
    seasonNumber
  );

  const { divisionsAndConferences } = await READ_SEASON_FIELD_DATA(
    leagueName,
    seasonNumber,
    "teams-conferences-and-divisions"
  );

  responseData.divisionsAndConferences = divisionsAndConferences;
  return JSON.stringify(responseData);
}

async function standingsPage() {
  const { standings, divisionsAndConferences } = JSON.parse(
    await getStandings(DEFAULT_LEAGUE, MOST_RECENT_SEASON)
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
