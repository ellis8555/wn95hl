import GameInputForm from "@/components/client/GameInputForm";
import {
  DEFAULT_LEAGUE,
  MOST_RECENT_SEASON,
} from "@/utils/constants/constants";

function page() {
  return (
    <div className="mt-[20%] ">
      <GameInputForm
        leagueName={DEFAULT_LEAGUE}
        seasonNumber={MOST_RECENT_SEASON}
      />
    </div>
  );
}

export default page;
