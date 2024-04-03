// gameData is the var that contains all of a game states data
"use client";

import { useEffect, useRef, useState } from "react";
import { useFullLeagueStandings } from "@/context/FullLeagueStandingsContext";
import readCSVGameStateFile from "@/utils/game-state-parsing/CSV-game-state/read-csv-game-state-file";
import readBinaryGameStateReversed from "@/utils/game-state-parsing/game-state/read-game-state-reverse";
import {
  GET_LEAGUE_DATA,
  POST_JSON_TO_API,
} from "@/utils/constants/data-calls/api_calls";
import { STATE_PATTERN } from "@/utils/constants/constants";

function ReverseGameInputForm() {
  const [gameData, setGameData] = useState(null);
  const [serverMessage, setServerMessage] = useState("");
  const [gameSubmitError, setGameSubmitError] = useState(false);
  const [gameScoreOnError, setGameScoreOnError] = useState("");
  const [isStateUploaded, setIsStateUploaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    setClientRecentlyPlayedGames,
    setClientSideStandings,
    setRefreshTheStandings,
    setLeagueContext,
    setSeasonNumberContext,
  } = useFullLeagueStandings();

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
        // disable the submit button
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
        const fetchedGameData = await readCSVGameStateFile(
          file,
          seasonNumber.current,
          gameType.current,
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
          setSeasonNumberContext(seasonNumber.current);
          setRefreshTheStandings(true);
          setClientSideStandings(updatedStandings);
          setClientRecentlyPlayedGames(updateRecentlyPlayedGames);
          setIsSubmitting(false)
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
          setIsSubmitting(false)
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
          const fetchedGameData = await readBinaryGameStateReversed(
            file,
            seasonNumber.current,
            gameType.current,
            leagueName.current,
            dictCodes
          );
          gameStatesData.push(fetchedGameData);
          setLeagueContext(leagueName.current);
          setSeasonNumberContext(seasonNumber.current);
          setGameData(gameStatesData[0]);
        } else {
          setIsSubmitting(false)
          setServerMessage("File name is not associated with a league yet");
        }
      }
    } catch (error) {
      fileInputRef.current.value = null;
      setIsStateUploaded(false);
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
      setRefreshTheStandings(true);
      setClientSideStandings(updatedStandings);
      setClientRecentlyPlayedGames(updateRecentlyPlayedGames);
      setServerMessage("Game submitted");
      setIsSubmitting(false)
    } catch (error) {
      const homeTeam = gameData["data"]["homeTeamGameStats"]["HomeTeam"];
      const homeTeamScore = gameData["data"]["homeTeamGameStats"]["HomeGOALS"];
      const awayTeam = gameData["data"]["awayTeamGameStats"]["AwayTeam"];
      const awayTeamScore = gameData["data"]["awayTeamGameStats"]["AwayGOALS"];
      const gameScoreOnErrorMessage = `(Away)  ${awayTeam} ${awayTeamScore} - ${homeTeamScore} ${homeTeam}  (Home)`;
      fileInputRef.current.value = null;
      setIsStateUploaded(false);
      setServerMessage(error.message);
      setGameScoreOnError(gameScoreOnErrorMessage);
      setGameSubmitError(true);
      setIsSubmitting(false)
    }
  }

  return (
    <div
    className="w-10/12 md:w-1/2 lg:w-4/12"
      onClick={() => {
        setIsStateUploaded(false);
      }}
    >
      <div className="text-center text-slate-300">This upload will reverse the home team to away and vice versa</div>
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
            setGameSubmitError(false);
            setGameScoreOnError("");
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

export default ReverseGameInputForm;
