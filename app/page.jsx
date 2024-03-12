import Link from "next/link"
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
        <Link className="underline" href="/news">Update on game state uploads</Link>
        </Alert>
        <Alert>Issue: Q games that have a OT length over 5 mins return states ending at 20 mins resulting in a tie</Alert>
        <Alert>Vintage league is now live</Alert>
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
        </div>
        {/* end of league cards */}
      </div>
    </div>
  );
}
