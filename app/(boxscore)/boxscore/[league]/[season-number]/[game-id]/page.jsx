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
  const homeShootingPct = (homeGoals / homeShots) * 100;
  const homePenalties = gamesData.homeTeamGameStats["HomePENALTIES"];
  const homePpGoals = gamesData.homeTeamGameStats["HomePP GOALS"];
  const homePpOpportunities = gamesData.homeTeamGameStats["HomePP OPP"];
  const homeShortHandedGoals = gamesData.homeTeamGameStats["HomeSHG"];
  const homeBreakAways = gamesData.homeTeamGameStats["HomeBREAKAWAY"];
  const homeBreakAwayGoals = gamesData.homeTeamGameStats["HomeBREAKAWAY GOALS"];
  const homePenaltyShots = gamesData.homeTeamGameStats["HomePENALTY SHOTS"];
  const homePenaltyShotGoals =
    gamesData.homeTeamGameStats["HomePENALTY SHOT GOALS"];
  const homeBodyChecks = gamesData.homeTeamGameStats["HomeCHECKS"];
  const homeAttackZone = gamesData.homeTeamGameStats["HomeATTACK"];

  //away team stats
  const awayGoals = gamesData.awayTeamGameStats["AwayGOALS"];
  const awayShots = gamesData.awayTeamGameStats["AwaySHOTS"];
  const awayShootingPct = (awayGoals / awayShots) * 100;
  const awayPenalties = gamesData.awayTeamGameStats["AwayPENALTIES"];
  const awayPpGoals = gamesData.awayTeamGameStats["AwayPP GOALS"];
  const awayPpOpportunities = gamesData.awayTeamGameStats["AwayPP OPP"];
  const awayShortHandedGoals = gamesData.awayTeamGameStats["AwaySHG"];
  const awayBreakAways = gamesData.awayTeamGameStats["AwayBREAKAWAY"];
  const awayBreakAwayGoals = gamesData.awayTeamGameStats["AwayBREAKAWAY GOALS"];
  const awayPenaltyShots = gamesData.awayTeamGameStats["AwayPENALTY SHOTS"];
  const awayPenaltyShotGoals =
    gamesData.awayTeamGameStats["AwayPENALTY SHOT GOALS"];
  const awayBodyChecks = gamesData.awayTeamGameStats["AwayCHECKS"];
  const awayAttackZone = gamesData.awayTeamGameStats["AwayATTACK"];

  // returns formatted stat
  function DisplayStat({ awayStat, statName, homeStat }) {
    return (
      <div className="flex flex-row justify-center items-center gap-12 py-3 lg:w-1/2 mx-auto">
        <div className="w-5/12">{awayStat}</div>
        <div className="w-2/12 font-bold">{statName}</div>
        <div className="w-5/12">{homeStat}</div>
      </div>
    );
  }

  return (
    <div className="text-center text-slate-300  w-4/5 md:w-3/4 mx-auto">
      {/* team logos */}
      <div className="flex flex-row justify-center items-center gap-12 py-3 md:py-6 lg:w-1/2 mx-auto">
        <div className="w-5/12 flex justify-end ">
          <TeamLogo name={awayTeam} width="50" height="50" />
        </div>
        <div className="w-2/12 font-bold">@</div>
        <div className="w-5/12 flex justify-start">
          <TeamLogo name={homeTeam} width="50" height="50" />
        </div>
      </div>
      {/* game stats begin */}
      {/* score */}
      <DisplayStat awayStat={awayGoals} statName="Score" homeStat={homeGoals} />
      {/* shots */}
      <DisplayStat awayStat={awayShots} statName="Shots" homeStat={homeShots} />
      {/* shooting percentage */}
      <DisplayStat
        awayStat={awayShootingPct.toFixed(2) + "%"}
        statName="Shooting"
        homeStat={homeShootingPct.toFixed(2) + "%"}
      />
      {/* power play */}
      <DisplayStat
        awayStat={`${awayPpGoals}/${awayPpOpportunities}`}
        statName="PP"
        homeStat={`${homePpGoals}/${homePpOpportunities}`}
      />
      {/* penalties */}
      <DisplayStat
        awayStat={awayPenalties}
        statName="Penalties"
        homeStat={homePenalties}
      />
      {/* short handed goals */}
      <DisplayStat
        awayStat={awayShortHandedGoals}
        statName="SHG"
        homeStat={homeShortHandedGoals}
      />
      {/* breakaways */}
      <DisplayStat
        awayStat={`${awayBreakAways} / ${awayBreakAwayGoals}`}
        statName="Breakaways"
        homeStat={`${homeBreakAways} / ${homeBreakAwayGoals}`}
      />
      {/* penalty shots */}
      <DisplayStat
        awayStat={`${awayPenaltyShots} / ${awayPenaltyShotGoals}`}
        statName="Penalty Shots"
        homeStat={`${homePenaltyShots} / ${homePenaltyShotGoals}`}
      />
      {/* body  checks */}
      <DisplayStat
        awayStat={awayBodyChecks}
        statName="Checks"
        homeStat={homeBodyChecks}
      />
      {/* attack zone */}
      <DisplayStat
        awayStat={awayAttackZone}
        statName="Attack"
        homeStat={homeAttackZone}
      />
    </div>
  );
}

export default page;
