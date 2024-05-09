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
        <Alert backgroundColor={"bg-green-600"}>I've decided to discontinue this project. I will finish out updating the W and Vintage until seasons end. Ultimately the overall goal was to enable each user to upload their own games states. This has been accomplished in a manner that both satisfies any website built while also providing what is needed to update the sheets.</Alert>
        <Alert backgroundColor={"bg-green-600"}>I will add cards on this homepage for each season that is currently stored in the database as well.</Alert>
        <Alert backgroundColor={"bg-green-600"}>As a personal hobby I will also work on a playoff bracket page for Q89 as I have saved all the playoff states for that season.</Alert>
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
