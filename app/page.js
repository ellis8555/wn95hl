import GameInputForm from "@/components/client/GameInputForm";
import {
  DEFAULT_LEAGUE,
  MOST_RECENT_SEASON,
} from "@/utils/constants/constants";
import { DOMAIN } from "@/utils/constants/connections";
import { API_READ_SEASON_DATA } from "@/utils/constants/api_consts";

export const metadata = {
  title: "NHL95",
  description: "Test site for NHL95",
};

const mostRecentSeason = await API_READ_SEASON_DATA(
  DOMAIN,
  DEFAULT_LEAGUE,
  MOST_RECENT_SEASON,
  "most-recent-season"
);

export default async function Home() {
  return (
    <>
      <h1 className="text-3xl text-center">nhl95.net affiliated test area</h1>
      <GameInputForm
        leagueName={DEFAULT_LEAGUE}
        seasonNumber={mostRecentSeason}
      />
    </>
  );
}
