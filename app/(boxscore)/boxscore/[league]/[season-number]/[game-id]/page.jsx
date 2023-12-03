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

  // was OT required
  const overtimeGame = gamesData.otherGameStats["overtimeRequired"];

  // home team stats
  const homeTeam = gamesData.otherGameStats["homeTeam"];
  const homeTeamsRecord = await LeagueSchema.getSingleTeamStandings(
    seasonNumber,
    homeTeam
  );
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
  const awayTeam = gamesData.otherGameStats["awayTeam"];
  const awayTeamsRecord = await LeagueSchema.getSingleTeamStandings(
    seasonNumber,
    awayTeam
  );
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
      <div className="flex flex-row justify-center items-center gap-2 py-3 lg:w-1/2 mx-auto">
        <div className="w-4/12 bg-slate-800">{awayStat}</div>
        <div className="w-8/12 bg-slate-800 font-bold">{statName}</div>
        <div className="w-4/12 bg-slate-800">{homeStat}</div>
      </div>
    );
  }

  return (
    <div className="text-center text-slate-300  w-11/12 md:w-3/4 mx-auto">
      {overtimeGame && <div className="text-3xl text-orange-400 mt-4">OT</div>}
      {/* team logos */}
      <div className="flex flex-row justify-center items-center gap-12 pt-3 md:pt-6 lg:w-1/2 mx-auto">
        <div className="w-5/12 flex justify-end ">
          <TeamLogo name={awayTeam} width="50" height="50" />
        </div>
        <div className="w-2/12 font-bold text-xl">@</div>
        <div className="w-5/12 flex justify-start">
          <TeamLogo name={homeTeam} width="50" height="50" />
        </div>
      </div>

      {/* teams records */}
      <div className="flex flex-row justify-center items-center gap-12 py-3 lg:w-1/2 mx-auto">
        <div className="w-5/12 flex justify-end ">
          <div>{`( ${awayTeamsRecord.W} - ${awayTeamsRecord.L} - ${awayTeamsRecord.T} - ${awayTeamsRecord.OTL} )`}</div>
        </div>
        <div className="w-2/12 font-bold text-xl"></div>
        <div className="w-5/12 flex justify-start">
          <div>{`( ${homeTeamsRecord.W} - ${homeTeamsRecord.L} - ${homeTeamsRecord.T} - ${homeTeamsRecord.OTL} )`}</div>
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
        awayStat={`${awayBreakAwayGoals} / ${awayBreakAways}`}
        statName="Breakaways"
        homeStat={`${homeBreakAwayGoals} / ${homeBreakAways}`}
      />
      {/* penalty shots */}
      <DisplayStat
        awayStat={`${awayPenaltyShotGoals} / ${awayPenaltyShots}`}
        statName="Penalty Shots"
        homeStat={`${homePenaltyShotGoals} / ${homePenaltyShots}`}
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
