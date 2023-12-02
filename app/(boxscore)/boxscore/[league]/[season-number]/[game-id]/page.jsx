import getLeagueSchema from "@/app/(helpers)/get-league-schema";
import TeamLogo from "@/components/server/standings/TeamLogo";

import { connectToDb } from "@/utils/database";

async function page({ params }) {
  const leagueName = params["league"];
  const seasonNumber = params["season-number"];
  const gameId = params["game-id"];

  const LeagueSchema = await getLeagueSchema(leagueName);
  await connectToDb();

  const fetchGamesData = await LeagueSchema.getSingleGame(seasonNumber, gameId);
  const gamesData = fetchGamesData[0];

  const homeTeam = gamesData.otherGameStats["homeTeam"];
  const awayTeam = gamesData.otherGameStats["awayTeam"];

  // home team stats
  const homeGoals = gamesData.homeTeamGameStats["HomeGOALS"];
  const homeShots = gamesData.homeTeamGameStats["HomeSHOTS"];
  const homePenalties = gamesData.homeTeamGameStats["HomePENALTIES"];

  //away team stats
  const awayGoals = gamesData.awayTeamGameStats["AwayGOALS"];
  const awayShots = gamesData.awayTeamGameStats["AwaySHOTS"];
  const awayPenalties = gamesData.awayTeamGameStats["AwayPENALTIES"];

  return (
    <div className="text-center text-slate-300">
      <h1 className="text-3xl py-3 text-orange-400">More stats coming soon</h1>

      {/* team logos */}
      <div className="flex flex-row justify-center items-center gap-24 py-3 md:py-6 md:w-1/2 mx-auto">
        <div className="w-1/3 flex justify-center">
          <TeamLogo name={awayTeam} width="50" height="50" />
        </div>
        <div className="w-1/3"></div>
        <div className="w-1/3 flex justify-center">
          <TeamLogo name={homeTeam} width="50" height="50" />
        </div>
      </div>
      {/* game stats begin */}
      {/* score */}
      <div className="flex flex-row justify-center items-center gap-24 py-3 md:w-1/2 mx-auto">
        <div className="w-1/3">{awayGoals}</div>
        <div className="w-1/3">Score</div>
        <div className="w-1/3">{homeGoals}</div>
      </div>
      {/* shots */}
      <div className="flex flex-row justify-center items-center gap-24 py-3 md:w-1/2 mx-auto">
        <div className="w-1/3">{awayShots}</div>
        <div className="w-1/3">Shots</div>
        <div className="w-1/3">{homeShots}</div>
      </div>
      {/* penalties */}
      <div className="flex flex-row justify-center items-center gap-24 py-3 md:w-1/2 mx-auto">
        <div className="w-1/3">{awayPenalties}</div>
        <div className="w-1/3">Penalties</div>
        <div className="w-1/3">{homePenalties}</div>
      </div>
    </div>
  );
}

export default page;
