// gameData is the var that contains all of a game states data
"use client";

import { useRef, useState, useEffect } from "react";
import { useFullLeagueStandings } from "@/context/FullLeagueStandingsContext";
import readCSVGameStateFile from "@/utils/game-state-parsing/CSV-game-state/read-csv-game-state-file";
import readBinaryGameState from "@/utils/game-state-parsing/game-state/read-game-state";
import {
  GET_LEAGUE_DATA,
  POST_JSON_TO_API,
} from "@/utils/constants/data-calls/api_calls";
import {
  DEFAULT_LEAGUE,
  MOST_RECENT_SEASON,
} from "@/utils/constants/constants";

function GameInputForm() {
  const [gameData, setGameData] = useState(null);
  const [serverMessage, setServerMessage] = useState("");
  const [gameSubmitError, setGameSubmitError] = useState(false);
  const [gameScoreOnError, setGameScoreOnError] = useState("");
  const [isStateUploaded, setIsStateUploaded] = useState(false);

  const {
    setClientRecentlyPlayedGames,
    setClientSideStandings,
    setRefreshTheStandings,
    setLeagueContext,
    setSeasonNumbercontext,
  } = useFullLeagueStandings();

  const leagueName = useRef(DEFAULT_LEAGUE);
  const seasonNumber = useRef(MOST_RECENT_SEASON);

  const fileInputRef = useRef(null);
  ///////////////////////////////////////////////////////////
  // gameType still needs to be incorporated and made dynamic
  ///////////////////////////////////////////////////////////
  const gameTypeRef = useRef(null);

  useEffect(() => {
    fetchGameData();
  }, [gameData]);

  // submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const file = fileInputRef.current.files[0];
    if (!file) {
      alert("No file selected");
      return;
    }

    const fileName = file.name;

    // message user the file is being processed
    setServerMessage("Game file being processed...");

    ///////////////////////////////////////////
    // get game type to add to game state file
    // TO BE REMOVED AND MADE DYNAMIC
    ///////////////////////////////////////////
    const gameType = gameTypeRef.current.value;
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
        // this readCSVGameStateFile returns all the parsed game data
        const fetchedGameData = await readCSVGameStateFile(
          file,
          seasonNumber.current,
          gameType,
          leagueName.current
        );
        fetchedGameData.forEach((gameState) => gameStatesData.push(gameState));
        const howManyGamesSubmitted = gameStatesData.length;

        // declare i here so it can be passed to the catch block for error reference
        try {
          for (let i = 0; i < howManyGamesSubmitted; i++) {
            // if multiple games uploaded via csv file
            // set boolean to inform the server that the last game has been submitted
            // the last game submitted will elicit a response requesting updated standings and recent results
            let isLastGame = false;
            if (i === howManyGamesSubmitted - 1) {
              isLastGame = true;
            }
            const response = await POST_JSON_TO_API(
              "game-result",
              gameStatesData[i],
              isLastGame
            );

            if (response.error) {
              const errorMessage = response.message;
              throw Error(errorMessage + ` at excel line ${i + 2}`);
            }

            setServerMessage(`${i} states processed..`);
          }

          fileInputRef.current.value = null;

          // update the standings table after submitting game result
          setServerMessage("Updating the standings...");
          const standingsResponse = await GET_LEAGUE_DATA(
            leagueName.current,
            seasonNumber.current,
            "standings",
            "recent-results"
          );
          // get newly updated standings
          const {
            standings: updatedStandings,
            recentlyPlayedGames,
            totalGamesSubmitted: howManyGamesPlayed,
          } = standingsResponse;

          // update the boxscores
          let updateRecentlyPlayedGames;
          if (recentlyPlayedGames.length < 8) {
            updateRecentlyPlayedGames = recentlyPlayedGames;
          } else {
            updateRecentlyPlayedGames = recentlyPlayedGames.slice(
              howManyGamesPlayed - 8
            );
          }

          setLeagueContext(leagueName.current);
          setSeasonNumbercontext(seasonNumber.current);
          setRefreshTheStandings(true);
          setClientSideStandings(updatedStandings);
          setClientRecentlyPlayedGames(updateRecentlyPlayedGames);
          fileInputRef.current.value = null;
          if (howManyGamesSubmitted > 1) {
            setServerMessage(
              `${howManyGamesSubmitted} games have been submitted`
            );
          } else {
            setServerMessage(`Game submitted`);
          }
        } catch (error) {
          fileInputRef.current.value = null;
          setIsStateUploaded(false);
          throw Error(error.message);
        }
      } else {
        ////////////////////////
        // game state sumbission
        ////////////////////////

        // extract league name and season number from file name
        // example file name 'WS03.state56
        leagueName.current = fileName[0].toLowerCase();
        if (fileName[2] === "0") {
          seasonNumber.current = fileName[3];
        } else {
          seasonNumber.current = fileName[2] + fileName[3];
        }
        // pattern to test filename for acceptance
        const statePattern = /[WQ][SP]?\d{1,3}\.state\d{1,3}/;
        if (statePattern.test(fileName)) {
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
            gameType,
            leagueName.current,
            dictCodes
          );
          gameStatesData.push(fetchedGameData);
          setGameData(gameStatesData[0]);
        } else {
          setServerMessage("File name is not associated with a league yet");
        }
      }
    } catch (error) {
      fileInputRef.current.value = null;
      setIsStateUploaded(false);
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
    setIsStateUploaded(true);
    // message the user request has been sent
    setServerMessage("Sending...");
    try {
      const response = await POST_JSON_TO_API("game-result", gameData);
      if (response.error) {
        throw Error(response.message);
      }

      // edit user message
      setServerMessage("Updating the standings...");
      const standingsResponse = await GET_LEAGUE_DATA(
        leagueName.current,
        seasonNumber.current,
        "standings",
        "recent-results"
      );
      // get newly updated standings
      const {
        standings: updatedStandings,
        recentlyPlayedGames,
        totalGamesSubmitted: howManyGamesPlayed,
      } = standingsResponse;
      // update the boxscores
      let updateRecentlyPlayedGames;
      if (recentlyPlayedGames.length < 8) {
        updateRecentlyPlayedGames = recentlyPlayedGames;
      } else {
        updateRecentlyPlayedGames = recentlyPlayedGames.slice(
          howManyGamesPlayed - 8
        );
      }
      setLeagueContext(leagueName.current);
      setRefreshTheStandings(true);
      setClientSideStandings(updatedStandings);
      setClientRecentlyPlayedGames(updateRecentlyPlayedGames);
      setServerMessage("Game submitted");
    } catch (error) {
      const homeTeam = gameData["data"]["homeTeamGameStats"]["HomeTeam"];
      const homeTeamScore = gameData["data"]["homeTeamGameStats"]["HomeGOALS"];
      const awayTeam = gameData["data"]["awayTeamGameStats"]["AwayTeam"];
      const awayTeamScore = gameData["data"]["awayTeamGameStats"]["AwayGOALS"];
      const gameScoreOnErrorMessage = `(Away)  ${awayTeam} ${awayTeamScore} - ${homeTeamScore} ${homeTeam}  (Home)`;
      // console.log(gameData.data);
      fileInputRef.current.value = null;
      setIsStateUploaded(false);
      setServerMessage(error.message);
      setGameScoreOnError(gameScoreOnErrorMessage);
      setGameSubmitError(true);
    }
  }

  return (
    <div
      onClick={() => {
        setIsStateUploaded(false);
      }}
    >
      <form
        className="flex flex-row justify-between w-10/12 mt-4 bg-slate-800 mx-auto md:rounded-lg p-3 md:max-w-md"
        onSubmit={handleSubmit}
      >
        <input
          type="file"
          ref={fileInputRef}
          id="fileInput"
          name="fileInput"
          onClick={() => {
            setServerMessage("");
            setGameSubmitError(false);
            setGameScoreOnError("");
          }}
          className="text-slate-300"
        />

        <input type="hidden" ref={gameTypeRef} name="gameType" value="season" />

        <div className="flex flex-row gap-2">
          <button
            className="border rounded-md border-slate-300 text-slate-300 px-2"
            type="submit"
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
      {gameSubmitError && (
        <>
          <div className="text-center text-slate-300 text-xl mt-2">
            Following game was not submitted
          </div>
          <div className="text-center text-slate-300 text-xl mt-2">
            {gameScoreOnError}
          </div>
        </>
      )}
    </div>
  );
}

export default GameInputForm;
