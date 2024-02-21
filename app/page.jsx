import Alert from "@/components/server/Alerts/Alert";
import LeagueCard from "@/components/server/LeagueCard";

export const metadata = {
  title: "NHL95",
  description: "Test site for NHL95",
};

export default async function Page() {
  return (
    <div className="flex justify-center my-2">
      <div className="text-slate-300">
        <h1 className="text-4xl lg:text-6xl text-center pt-4">
          NHL95 in development
        </h1>
        <Alert>
          Season 10 officially has begun! 
        </Alert>
        <Alert>
          Other leagues and historical data coming soon 
        </Alert>
        {/* beginning of league cards */}
        <div className="flex flex-col sm:flex-row justify-center mt-3 gap-3 md:gap-6 md:mt-6">
          <LeagueCard
            leagueName="w"
            seasonNumber="4"
            correspondingSeasonNumber="10"
          />
          <LeagueCard
            leagueName="w"
            seasonNumber="3"
            correspondingSeasonNumber="9"
          />
          <LeagueCard
            leagueName="q"
            seasonNumber="88"
            correspondingSeasonNumber="88"
          />
        </div>
        {/* end of league cards */}
      </div>
    </div>
  );
}
