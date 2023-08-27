// gameData is the var that contains all of a game states data
"use client";

import { useRef, useState } from "react";
import readGameStateFile from "@/utils/game-states/read-game-state-file";
import Standings from "./Standings";
import TestingMessage from "../server/standings/TestingMessage";
import readBinaryGameState from "@/utils/game-state/read-game-state";
import Boxscore from "../server/Boxscore";

function GameInputForm() {
  const [updateStandings, setUpdateStandings] = useState(null);
  const [serverMessage, setServerMessage] = useState("");
  const [boxscoreData, setBoxscoreData] = useState({});
  const fileInputRef = useRef(null);
  // three hidden input types for season and game type
  const seasonInputRef = useRef(null);
  const gameTypeRef = useRef(null);
  const leagueNameRef = useRef(null);

  // submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const file = fileInputRef.current.files[0];

    if (!file) {
      alert("No file selected");
      return;
    }

    // get current season, game type to add to game state file
    const currentSeason = seasonInputRef.current.value;
    const gameType = gameTypeRef.current.value;
    const leagueName = leagueNameRef.current.value;

    try {
      let gameData;

      if (file.name === "WN95HL_Game_Stats.csv") {
        // this returns all the parsed game data
        gameData = await readGameStateFile(
          file,
          currentSeason,
          gameType,
          leagueName
        );
      }

      // pattern to test filename for acceptance
      const statePattern = /WS\d{1,3}\.state\d{1,3}/;
      if (statePattern.test(file.name)) {
        // this returns all the parsed game data
        gameData = await readBinaryGameState(
          file,
          currentSeason,
          gameType,
          leagueName
        );
      }

      const homeData = gameData.data.homeTeamGameStats;
      const awayData = gameData.data.awayTeamGameStats;
      const otherData = gameData.data.otherGameStats;
      const boxscoreStats = {
        overtimeRequired: otherData.overtimeRequired,
        wasGameATie: otherData.wasGameATie,
        homeTeam: {
          acronym: otherData.homeTeam,
          homeScore: homeData.HomeGOALS,
        },
        awayTeam: {
          acronym: otherData.awayTeam,
          awayScore: awayData.AwayGOALS,
        },
      };
      setBoxscoreData(boxscoreStats);
      // message the user request has been sent
      setServerMessage("Sending...");
      const response = await fetch(`/api/game-result`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gameData),
      });

      if (!response.ok) {
        throw new Error(response.message);
      }

      const responseData = await response.json();
      setServerMessage("");
      setUpdateStandings(responseData.newStandings);
    } catch (error) {
      fileInputRef.current.value = "";
      setServerMessage(error.message);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  async function resetLeagueTable(e) {
    e.preventDefault();
    setServerMessage("Resetting the table");
    try {
      // message the user request has been sent
      const response = await fetch(`/api/tables/reset-table`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(response.message);
      }

      const clearedTable = await response.json();

      setServerMessage("");
      setBoxscoreData({});
      setUpdateStandings(clearedTable.newStandings);
    } catch (error) {
      setServerMessage(error.message);
    }
  }

  return (
    <>
      <form
        className="w-full mt-4 bg-slate-500 mx-auto md:rounded-lg p-3 md:max-w-md"
        onSubmit={handleSubmit}
      >
        <input
          type="file"
          ref={fileInputRef}
          id="fileInput"
          name="fileInput"
          onClick={() => setServerMessage("")}
        />
        <br />
        <br />
        <input
          type="hidden"
          ref={seasonInputRef}
          name="seasonNumber"
          value="8"
        />
        <input type="hidden" ref={leagueNameRef} name="leagueName" value="W" />
        <input type="hidden" ref={gameTypeRef} name="gameType" value="season" />

        <button className="border rounded-md border-black px-2" type="submit">
          Submit
        </button>
        <button
          className="border rounded-md border-black px-2 float-right"
          onClick={resetLeagueTable}
        >
          Reset
        </button>
      </form>

      {serverMessage && (
        <div className="text-center text-xl mt-2">{serverMessage}</div>
      )}
      <TestingMessage />
      {boxscoreData && <Boxscore boxscore={boxscoreData} />}
      <Standings updateStandings={updateStandings} />
    </>
  );
}

export default GameInputForm;
