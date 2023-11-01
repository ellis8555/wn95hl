import GameInputForm from "@/components/client/GameInputForm";

import {
  DEFAULT_LEAGUE,
  MOST_RECENT_SEASON,
} from "@/utils/constants/constants";

export const metadata = {
  title: "NHL95",
  description: "Test site for NHL95",
};

export default async function Page() {
  return (
    <div className="text-slate-300 center-div absolute">
      <GameInputForm
        leagueName={DEFAULT_LEAGUE}
        seasonNumber={MOST_RECENT_SEASON}
      />
      <h1 className="text-6xl text-center pt-4">NHL95 in development</h1>
    </div>
  );
}
