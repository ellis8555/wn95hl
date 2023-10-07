import GameInputForm from "@/components/client/GameInputForm";
import { DEFAULT_LEAGUE } from "@/utils/constants/constants";
import { DOMAIN } from "@/utils/constants/connections";

export const metadata = {
  title: "NHL95",
  description: "Test site for NHL95",
};

async function getMostRecentSeason() {
  const response = await fetch(
    `${DOMAIN}/api/season-data?field=most-recent-season`,
    {
      next: {
        revalidate: 0,
      },
    }
  );
  if (!response.ok) {
    const errorMessage = await response.json();
    throw new Error(errorMessage.message);
  }

  const mostRecentSeason = await response.json();
  return mostRecentSeason;
}

export default async function Home() {
  const mostRecentWSeason = await getMostRecentSeason();
  return (
    <>
      <h1 className="text-3xl text-center">nhl95.net affiliated test area</h1>
      <GameInputForm
        leagueName={DEFAULT_LEAGUE}
        seasonNumber={mostRecentWSeason}
      />
    </>
  );
}
