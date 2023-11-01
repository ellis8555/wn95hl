import GameInputForm from "@/components/client/GameInputForm";
import {
  DEFAULT_LEAGUE,
  MOST_RECENT_SEASON,
} from "@/utils/constants/constants";

export default async function Page() {
  return (
    <div className="center-div absolute">
      <GameInputForm
        leagueName={DEFAULT_LEAGUE}
        seasonNumber={MOST_RECENT_SEASON}
      />
    </div>
  );
}
