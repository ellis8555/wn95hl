import Alert from "@/components/server/Alerts/Alert";
import LeagueCard from "@/components/server/LeagueCard";

export const metadata = {
  title: "NHL95",
  description: "Test site for NHL95",
};

export default async function Page() {
  return (
    <div className="flex justify-center my-2">
      <div className="text-slate-300 w-full md:w-3/4 md:mx-auto">
        <h1 className="text-4xl lg:text-6xl text-center pt-4">
          Darkside Stats
        </h1>
        <Alert backgroundColor={"bg-green-600"}>Pure League game state upload tests needed. Live uploads should be enabled soon.</Alert>
        {/* beginning of league cards */}
        <div className="flex flex-col sm:flex-row justify-center mt-3 gap-3 md:gap-6 md:mt-6">
          <LeagueCard
            leagueName="w"
            seasonNumber="4"
            correspondingSeasonNumber="10"
          />
          <LeagueCard
            leagueName="q"
            seasonNumber="89"
            correspondingSeasonNumber="89"
          />
          <LeagueCard
            leagueName="v"
            seasonNumber="1"
            correspondingSeasonNumber="1"
          />
          <LeagueCard
            leagueName="p"
            seasonNumber="1"
            correspondingSeasonNumber="1"
          />
        </div>
        {/* end of league cards */}
      </div>
    </div>
  );
}
