import {
  LEAGUE_SCHEMA_SWITCH,
  LEAGUE_GAMES_SCHEMA_SWITCH,
} from "@/utils/constants/data-calls/db_calls";
import TeamLogo from "@/components/server/Logos/TeamLogo";

import { connectToDb } from "@/utils/database";

const dbCallFrom = "boxscore/[league]/[season-number]/[game=id]";

async function page({ params }) {
  const leagueName = params["league"];
  const seasonNumber = params["season-number"];
  const gameId = params["game-id"];

  await connectToDb(dbCallFrom);
  const LeagueSchema = await LEAGUE_SCHEMA_SWITCH(leagueName);
  const GameSchema = await LEAGUE_GAMES_SCHEMA_SWITCH(leagueName);

  // static methods on game schema to get stats
  const gamesOtherData = await GameSchema.getSingleGame(gameId);
  const homeTeamsStats = await GameSchema.getTeamsGameStats(gameId, "home");
  const awayTeamsStats = await GameSchema.getTeamsGameStats(gameId, "away");

  // was OT required
  const overtimeGame = gamesOtherData.otherGameStats["overtimeRequired"];

  // home team stats
  const homeTeam = gamesOtherData.otherGameStats["homeTeam"];
  const homeTeamsRecord = await LeagueSchema.getSingleTeamStandings(
    seasonNumber,
    homeTeam
  );
  const homeGoals = homeTeamsStats[0].gameStats["HomeGOALS"];
  const homeShots = homeTeamsStats[0].gameStats["HomeSHOTS"];
  const homeShootingPct = (homeGoals / homeShots) * 100;
  const homePenalties = homeTeamsStats[0].gameStats["HomePENALTIES"];
  const homePpGoals = homeTeamsStats[0].gameStats["HomePP GOALS"];
  const homePpOpportunities = homeTeamsStats[0].gameStats["HomePP OPP"];
  const homeShortHandedGoals = homeTeamsStats[0].gameStats["HomeSHG"];
  const homeBreakAways = homeTeamsStats[0].gameStats["HomeBREAKAWAY"];
  const homeBreakAwayGoals = homeTeamsStats[0].gameStats["HomeBREAKAWAY GOALS"];
  const homePenaltyShots = homeTeamsStats[0].gameStats["HomePENALTY SHOTS"];
  const homePenaltyShotGoals =
    homeTeamsStats[0].gameStats["HomePENALTY SHOT GOALS"];
  const homeBodyChecks = homeTeamsStats[0].gameStats["HomeCHECKS"];
  const homeAttackZone = homeTeamsStats[0].gameStats["HomeATTACK"];

  //away team stats
  const awayTeam = gamesOtherData.otherGameStats["awayTeam"];
  const awayTeamsRecord = await LeagueSchema.getSingleTeamStandings(
    seasonNumber,
    awayTeam
  );
  const awayGoals = awayTeamsStats[0].gameStats["AwayGOALS"];
  const awayShots = awayTeamsStats[0].gameStats["AwaySHOTS"];
  const awayShootingPct = (awayGoals / awayShots) * 100;
  const awayPenalties = awayTeamsStats[0].gameStats["AwayPENALTIES"];
  const awayPpGoals = awayTeamsStats[0].gameStats["AwayPP GOALS"];
  const awayPpOpportunities = awayTeamsStats[0].gameStats["AwayPP OPP"];
  const awayShortHandedGoals = awayTeamsStats[0].gameStats["AwaySHG"];
  const awayBreakAways = awayTeamsStats[0].gameStats["AwayBREAKAWAY"];
  const awayBreakAwayGoals = awayTeamsStats[0].gameStats["AwayBREAKAWAY GOALS"];
  const awayPenaltyShots = awayTeamsStats[0].gameStats["AwayPENALTY SHOTS"];
  const awayPenaltyShotGoals =
    awayTeamsStats[0].gameStats["AwayPENALTY SHOT GOALS"];
  const awayBodyChecks = awayTeamsStats[0].gameStats["AwayCHECKS"];
  const awayAttackZone = awayTeamsStats[0].gameStats["AwayATTACK"];

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
          <TeamLogo
            name={awayTeam}
            leagueName={leagueName}
            seasonNumber={seasonNumber}
            width="50"
            height="50"
          />
        </div>
        <div className="w-2/12 font-bold text-xl">@</div>
        <div className="w-5/12 flex justify-start">
          <TeamLogo
            name={homeTeam}
            leagueName={leagueName}
            seasonNumber={seasonNumber}
            width="50"
            height="50"
          />
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
        awayStat={awayShootingPct.toFixed(0) + "%"}
        statName="Shooting"
        homeStat={homeShootingPct.toFixed(0) + "%"}
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
