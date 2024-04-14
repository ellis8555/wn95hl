// gameData is the var that contains all of a game states data
"use client";

import { useEffect, useRef, useState } from "react";
import Alert from "@/components/server/Alerts/Alert";
import readBinaryGameState from "@/utils/game-state-parsing/game-state/read-game-state";
import readOgRomBinaryGameState from "@/utils/game-state-parsing/game-state/read-og-rom-game-state";
import { STATE_PATTERN, PURE_LEAGUE_STATE_PATTERN, MOST_RECENT_P_SEASON } from "@/utils/constants/constants";
import { GET_LEAGUE_DATA } from "@/utils/constants/data-calls/api_calls";

function ViewGameStateSubmitForm() {
  const [gameData, setGameData] = useState(null);
  const [serverMessage, setServerMessage] = useState("");
  const [hasGameBeenSubmitted, setHasGameBeenSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  ///////////////////////////////////////////////////
  // game stats state variables begin
  ///////////////////////////////////////////////////
  // home stats
  const [homeTeam, setHomeTeam] = useState(null)
  const [homeGoals, setHomeGoals] = useState(null);
  const [homeShots, setHomeShots] = useState(null);
  const [homeShootingPct, setHomeShootingPct] = useState(null)
  const [homePenalties, setHomePenalties] = useState(null);
  const [homePpGoals, setHomePpGoals] = useState(null);
  const [homePpOpportunities, setHomePpOpportunities] = useState(null);
  const [homeShortHandedGoals, setHomeShortHandedGoals] = useState(null);
  const [homeBreakAways, setHomeBreakAways] = useState(null);
  const [homeBreakAwayGoals, setHomeBreakAwayGoals] = useState(null);
  const [homePenaltyShots, setHomePenaltyShots] = useState(null);
  const [homePenaltyShotGoals, setHomePenaltyShotGoals] = useState(null);
  const [homeBodyChecks, setHomeBodyChecks] = useState(null);
  const [homeAttackZone, setHomeAttackZone] = useState(null);

  // away stats
  const [awayTeam, setAwayTeam] = useState(null)
  const [awayGoals, setAwayGoals] = useState(null);
  const [awayShots, setAwayShots] = useState(null);
  const [awayShootingPct, setAwayShootingPct] = useState(null)
  const [awayPenalties, setAwayPenalties] = useState(null);
  const [awayPpGoals, setAwayPpGoals] = useState(null);
  const [awayPpOpportunities, setAwayPpOpportunities] = useState(null);
  const [awayShortHandedGoals, setAwayShortHandedGoals] = useState(null);
  const [awayBreakAways, setAwayBreakAways] = useState(null);
  const [awayBreakAwayGoals, setAwayBreakAwayGoals] = useState(null);
  const [awayPenaltyShots, setAwayPenaltyShots] = useState(null);
  const [awayPenaltyShotGoals, setAwayPenaltyShotGoals] = useState(null);
  const [awayBodyChecks, setAwayBodyChecks] = useState(null);
  const [awayAttackZone, setAwayAttackZone] = useState(null);

  // other game stats
  const [overtimeGame, setOvertimeGame] = useState(false)

  const fileInputRef = useRef(null);
  const gameType = useRef(null);
  const leagueName = useRef(null)
  const seasonNumber = useRef(null)

  useEffect(() => {
      fetchGameData();
  }, [gameData]);

  // submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true)
    const file = fileInputRef.current.files[0];
    if (!file) {
      alert("No file selected");
      return;
    }
    
    const fileName = file.name;


    // message user the file is being processed
    setServerMessage("Game file being processed...");

    try {
      // array that will hold either a single or multiple game states
      // this depends on user submitting a game state
      // or admin submitting games via .csv file
      const gameStatesData = [];

      ///////////////////////////
      // CSV game file sumbission
      ///////////////////////////

      if (fileName === "WN95HL_Game_Stats.csv") {
        // prompt for the league name and season number for which this data applies to
        leagueName.current = prompt("Enter a league name");
        seasonNumber.current = prompt("Enter a season number");
        // prompt if game(s) are either of season/playoff type
        gameType.current = prompt("Enter 'season' or 'playoff'");

        // this readCSVGameStateFile returns all the parsed game data
        //FIXME:
        // const fetchedGameData = await readCSVGameStateFile(
        //   file,
        //   seasonNumber.current,
        //   gameType.current,
        //   leagueName.current
        // );
        alert("Currently csv game files not available just for viewing.")
      //////////////////////////////
      // pure league game submission
      //////////////////////////////
      } else if(PURE_LEAGUE_STATE_PATTERN.test(fileName)){
        leagueName.current = "p";
        seasonNumber.current = MOST_RECENT_P_SEASON;
        const fetchedGameData = await readOgRomBinaryGameState(
          file,
          seasonNumber.current,
          leagueName.current,
        );
        //FIXME: remove empty player slots before sending to database
        // trim empty goalie slots as some teams have 2 goalies while others 3 goalies
        if(fetchedGameData.data.awayTeamGoalieStats[2]['Name'] === "-"){
          fetchedGameData.data.awayTeamGoalieStats.splice(2);
        }
        if(fetchedGameData.data.homeTeamGoalieStats[2]['Name'] === "-"){
          fetchedGameData.data.homeTeamGoalieStats.splice(2);
        }
        // some teams only have 18 skaters
        if(fetchedGameData.data.awayTeamPlayerStats[18]?.Name === "-"){
          fetchedGameData.data.awayTeamPlayerStats.splice(18);
        }
        if(fetchedGameData.data.homeTeamPlayerStats[18]?.Name === "-"){
          fetchedGameData.data.homeTeamPlayerStats.splice(18);
        }
        // some teams only have 20 skaters
        if(fetchedGameData.data.awayTeamPlayerStats[20]?.Name === "-"){
          fetchedGameData.data.awayTeamPlayerStats.splice(20);
        }
        if(fetchedGameData.data.homeTeamPlayerStats[20]?.Name === "-"){
          fetchedGameData.data.homeTeamPlayerStats.splice(20);
        }
        // some teams only have 21 skaters
        if(fetchedGameData.data.awayTeamPlayerStats[21]?.Name === "-"){
          fetchedGameData.data.awayTeamPlayerStats.splice(21);
        }
        if(fetchedGameData.data.homeTeamPlayerStats[21]?.Name === "-"){
          fetchedGameData.data.homeTeamPlayerStats.splice(21);
        }
        console.log(fetchedGameData.data)
        //FIXME: end temp disable pure league upload
        gameStatesData.push(fetchedGameData);
        setGameData(gameStatesData[0]);
        setIsSubmitting(false)
        ////////////////////////
        // game state sumbission
        ////////////////////////
      } else {
        // extract league name and season number from file name
        // example file name 'WS03.state56
        leagueName.current = fileName[0].toLowerCase();
        if (fileName[2] === "0") {
          seasonNumber.current = fileName[3];
        } else {
          seasonNumber.current = fileName[2] + fileName[3];
        }

        // get if game is season/playoff game via abbreviation
        const gameTypeAbbr = fileName[1].toLowerCase();
        if (gameTypeAbbr === "s") {
          gameType.current = "season";
        } else if (gameTypeAbbr === "p") {
          gameType.current = "playoff";
        } else {
          return;
        }

        // test filename for acceptance
        if (STATE_PATTERN.test(fileName)) {
          const response = await GET_LEAGUE_DATA(
            leagueName.current,
            seasonNumber.current,
            "team-codes"
          );
          if (response.error) {
            // throw Error("An error has occured. File has not been submitted.");
            throw Error(response.message);
          }
          // teamsDict is name from python file
          // object containing list of team acronyms required for game state parsing
          const { dictCodes } = response;
          // this returns all the parsed game data
          const fetchedGameData = await readBinaryGameState(
            file,
            seasonNumber.current,
            gameType.current,
            leagueName.current,
            dictCodes
          );
          gameStatesData.push(fetchedGameData);
          setGameData(gameStatesData[0]);
          setIsSubmitting(false)
        } else {
          setServerMessage("File name is not associated with a league yet");
          setIsSubmitting(false)
        }
      }
    } catch (error) {
      fileInputRef.current.value = null;
      setIsSubmitting(false)
      setServerMessage(error.message);
    }

    if (fileInputRef.current != "") {
      fileInputRef.current.value = null;
    }
  };

  async function fetchGameData() {
    if (!gameData) {
      return;
    }
        // disable the submit button
        setIsSubmitting(true)
    // home stats
    setHomeTeam(gameData.data.otherGameStats["homeTeam"])
    setHomeGoals(gameData.data.homeTeamGameStats["HomeGOALS"]);
    setHomeShots(gameData.data.homeTeamGameStats["HomeSHOTS"]);
    setHomeShootingPct((homeGoals / homeShots) * 100)
    setHomePenalties(gameData.data.homeTeamGameStats["HomePENALTIES"]);
    setHomePpGoals(gameData.data.homeTeamGameStats["HomePP GOALS"]);
    setHomePpOpportunities(gameData.data.homeTeamGameStats["HomePP OPP"]);
    setHomeShortHandedGoals(gameData.data.homeTeamGameStats["HomeSHG"]);
    setHomeBreakAways(gameData.data.homeTeamGameStats["HomeBREAKAWAY"]);
    setHomeBreakAwayGoals(gameData.data.homeTeamGameStats["HomeBREAKAWAY GOALS"]);
    setHomePenaltyShots(gameData.data.homeTeamGameStats["HomePENALTY SHOTS"]);
    setHomePenaltyShotGoals(gameData.data.homeTeamGameStats["HomePENALTY SHOT GOALS"]);
    setHomeBodyChecks(gameData.data.homeTeamGameStats["HomeCHECKS"]);
    setHomeAttackZone(gameData.data.homeTeamGameStats["HomeATTACK"]);
    // away stats
    setAwayTeam(gameData.data.otherGameStats["awayTeam"])
    setAwayGoals(gameData.data.awayTeamGameStats["AwayGOALS"]);
    setAwayShots(gameData.data.awayTeamGameStats["AwaySHOTS"]);
    setAwayShootingPct((awayGoals / awayShots) * 100)
    setAwayPenalties(gameData.data.awayTeamGameStats["AwayPENALTIES"]);
    setAwayPpGoals(gameData.data.awayTeamGameStats["AwayPP GOALS"]);
    setAwayPpOpportunities(gameData.data.awayTeamGameStats["AwayPP OPP"]);
    setAwayShortHandedGoals(gameData.data.awayTeamGameStats["AwaySHG"]);
    setAwayBreakAways(gameData.data.awayTeamGameStats["AwayBREAKAWAY"]);
    setAwayBreakAwayGoals(gameData.data.awayTeamGameStats["AwayBREAKAWAY GOALS"]);
    setAwayPenaltyShots(gameData.data.awayTeamGameStats["AwayPENALTY SHOTS"]);
    setAwayPenaltyShotGoals(gameData.data.awayTeamGameStats["AwayPENALTY SHOT GOALS"]);
    setAwayBodyChecks(gameData.data.awayTeamGameStats["AwayCHECKS"]);
    setAwayAttackZone(gameData.data.awayTeamGameStats["AwayATTACK"]);
    // other game stats
    setOvertimeGame(gameData.data.otherGameStats["overtimeRequired"])
    // this boolean triggers the game data to be displayed
    setHasGameBeenSubmitted(true)
    setServerMessage("")
    setIsSubmitting(false)
    }
  
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
    <>
    <div
    className="w-10/12 md:w-1/2 lg:w-4/12 mx-auto"
    >
      <Alert>Pure league uploads now working correctly. You can view all the data in dev tools console (pressing f12)</Alert>
        <h1 className="text-center text-2xl text-orange-400">View a game state</h1>
        <h2 className="text-center text-md mt-2">This is only for viewing results. No upload will occur.</h2>
      <form
        className="flex flex-row justify-between mt-4 bg-slate-800 mx-auto rounded-lg p-3"
        onSubmit={handleSubmit}
      >
        <input
          type="file"
          ref={fileInputRef}
          id="fileInput"
          name="fileInput"
          onClick={() => {
            setServerMessage("");
            setHasGameBeenSubmitted(false)
          }}
          className="text-slate-300"
        />

        <div className="flex flex-row gap-2">
          <button
            className={`border rounded-md border-slate-300 text-slate-300 px-2 ${isSubmitting ? "opacity-50" : ""}`}
            type="submit"
            disabled={isSubmitting}
          >
            Submit
          </button>
        </div>
      </form>
      {serverMessage && (
        <div className="text-center text-slate-300 text-xl mt-2">
          {serverMessage}
        </div>
      )}
          </div>
          {/* display the game results beginning here */}
      {hasGameBeenSubmitted && 
            <div className="text-center text-slate-300 mt-8">
      {overtimeGame && <div className="text-3xl text-orange-400 mt-4">OT</div>}
        <div className="text-center text-slate-300 mx-2">
    {/* game stats begin */}
      {/* teams */}
      <DisplayStat awayStat={`${awayTeam} (Away)`} statName="Teams" homeStat={`${homeTeam} (Home)`} />
      {/* score */}
      <DisplayStat awayStat={awayGoals} statName="Score" homeStat={homeGoals} />
      {/* shots */}
      <DisplayStat awayStat={awayShots} statName="Shots" homeStat={homeShots} />
      {/* shooting percentage */}
      <DisplayStat
        awayStat={isNaN(awayGoals/awayShots) ? "0%": ((awayGoals/awayShots)*100).toFixed(0) + "%"}
        statName="Shooting"
        homeStat={isNaN(homeGoals/homeShots) ? "0%" : ((homeGoals/homeShots)*100).toFixed(0) + "%"}
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
        </div>
      }
    </>
);
      }  

export default ViewGameStateSubmitForm;