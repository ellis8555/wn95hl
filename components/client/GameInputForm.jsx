// gameData is the var that contains all of a game states data
"use client";

import { useRef, useState, useEffect } from "react";
import { useFullLeagueStandings } from "@/context/FullLeagueStandingsContext";
import readGameStateFile from "@/utils/game-state-parsing/CSV-game-state/read-game-state-file";
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

    leagueName.current = fileName[0].toLowerCase();
    if (fileName[2] === "0") {
      seasonNumber.current = fileName[3];
    } else {
      seasonNumber.current = fileName[2] + fileName[3];
    }

    // message user the file is being processed
    setServerMessage("Game file being processed...");

    ///////////////////////////////////////////
    // get game type to add to game state file
    // TO BE REMOVED AND MADE DYNAMIC
    ///////////////////////////////////////////
    const gameType = gameTypeRef.current.value;
    try {
      const fetchedCSVData = [];

      if (fileName === "WN95HL_Game_Stats.csv") {
        // this returns all the parsed game data
        const fetchedGameData = await readGameStateFile(
          file,
          seasonNumber.current,
          gameType,
          leagueName.current
        );
        fetchedGameData.forEach((gameState) => fetchedCSVData.push(gameState));
        const howManyGamesSubmitted = fetchedCSVData.length;

        // declare i here so it can be passed to the catch block for error reference
        try {
          const responses = [];
          for (let i = 0; i < howManyGamesSubmitted; i++) {
            const response = await POST_JSON_TO_API(fetchedCSVData[i]);

            if (response.error) {
              const errorMessage = response.message;
              throw Error(errorMessage + ` at index ${i}`);
            }

            setServerMessage(`${i} states processed..`);
            responses.push(await response.json());
          }

          fileInputRef.current = null;
          setServerMessage(
            `${howManyGamesSubmitted} games have been submitted`
          );

          // update the standings table after submitting game result
          const standingsResponse = await GET_LEAGUE_DATA(
            leagueName.current,
            seasonNumber.current,
            "standings"
          );
          // get the standings object out of the fetch
          const { standings: updatedStandings } = standingsResponse;

          // update the boxscores
          let updateRecentlyPlayedGames;
          if (updatedStandings.length < 8) {
            updateRecentlyPlayedGames = updatedStandings;
          } else {
            const howManyGamesPlayed = updatedStandings.length;
            updateRecentlyPlayedGames = updatedStandings.slice(
              howManyGamesPlayed - 8
            );
          }

          setRefreshTheStandings(true);
          setClientSideStandings(updatedStandings);
          setClientRecentlyPlayedGames(updateRecentlyPlayedGames);
          setServerMessage("");
        } catch (error) {
          fileInputRef.current.value = null;
          setIsStateUploaded(false);
          throw Error(error.message);
        }
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
        fetchedCSVData.push(fetchedGameData);
        setGameData(fetchedCSVData[0]);
      } else {
        setServerMessage("File name is not associated with a league yet");
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
      const { standings: updatedStandings, recentlyPlayedGames } =
        standingsResponse;
      // update the boxscores
      let updateRecentlyPlayedGames;
      if (recentlyPlayedGames.length < 8) {
        updateRecentlyPlayedGames = recentlyPlayedGames;
      } else {
        const howManyGamesPlayed = recentlyPlayedGames.length;
        updateRecentlyPlayedGames = recentlyPlayedGames.slice(
          howManyGamesPlayed - 8
        );
      }
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
