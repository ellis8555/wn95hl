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
    <div className="flex justify-center mt-2">
      <div className="text-slate-300">
        <h1 className="text-4xl lg:text-6xl text-center pt-4">
          NHL95 in development
        </h1>
        <GameInputForm
          leagueName={DEFAULT_LEAGUE}
          seasonNumber={MOST_RECENT_SEASON}
        />
        <p className="text-center mt-4">
          Temporary demo login:
          <br />
          <span className="underline underline-offset-4">
            username and password
          </span>{" "}
          are both <span className="text-green-400">'admin'</span>
          <br />
          <span className="underline underline-offset-4">Arrow icon</span> on
          navbar is login/out
        </p>
      </div>
    </div>
  );
}
