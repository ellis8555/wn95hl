// gameData is the var that contains all of a game states data
"use client";

import { useRef, useState } from "react";
import readGameStateFile from "@/utils/game-states/read-game-state-file";
import Standings from "./Standings";

function GameInputForm() {
  const [updateStandings, setUpdateStandings] = useState([]);
  const [serverMessage, setServerMessage] = useState("");
  const fileInputRef = useRef(null);
  // three hidden input types for season and game type
  const seasonInputRef = useRef(null);
  const gameTypeRef = useRef(null);
  const leagueNameRef = useRef(null);

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
      // this returns all the parsed game data
      const gameData = await readGameStateFile(
        file,
        currentSeason,
        gameType,
        leagueName,
        currentSeason
      );
      // message the user request has been sent
      setServerMessage("Sending...");

      const base_uri = process.env.NEXT_PUBLIC_URI_BASE;
      const sendGameFile = await fetch(`/api/game-result`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gameData),
      });
      const response = await sendGameFile.json();

      if (!response) {
        throw new Error(response.message);
      }

      if (response) {
        setServerMessage("");
        setUpdateStandings(response.newStandings);
      }
    } catch (error) {
      fileInputRef.current.value = "";
      setServerMessage(error.message);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const clearServerMessage = () => {
    setServerMessage("");
  };

  async function resetLeagueTable(e) {
    e.preventDefault();
    setServerMessage("Resetting the table");
    try {
      // message the user request has been sent
      const base_uri = process.env.NEXT_PUBLIC_URI_BASE;
      const requestTableReset = await fetch(`/api/tables/reset-table`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await requestTableReset.json();

      if (!response) {
        throw new Error(response.message);
      }

      if (response) {
        setServerMessage("");
        setUpdateStandings(response.newStandings);
      }
    } catch (error) {
      setServerMessage(error.message);
    }
  }

  return (
    <>
      <form
        className="w-3/4 mt-4 bg-slate-500 mx-auto rounded-lg p-3"
        onSubmit={handleSubmit}
      >
        <input
          type="file"
          ref={fileInputRef}
          id="fileInput"
          name="fileInput"
          accept=".csv"
          onClick={clearServerMessage}
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
          Reset Table
        </button>
      </form>

      {serverMessage && (
        <div className="text-center text-xl mt-2">{serverMessage}</div>
      )}
      <Standings updateStandings={updateStandings} />
    </>
  );
}

export default GameInputForm;
