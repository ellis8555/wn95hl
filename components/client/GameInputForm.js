// gameData is the var that contains all of a game states data
"use client";

import { useRef, useState, useEffect } from "react";
import readGameStateFile from "@/utils/CSV-game-state/read-game-state-file";
import Standings from "./Standings";
import readBinaryGameState from "@/utils/game-state/read-game-state";
import Boxscore from "../server/Boxscore/Boxscore";
import TableButton from "../server/Buttons/TableButton";

function GameInputForm({ leagueName, seasonNumber }) {
  const [gameData, setGameData] = useState(null);
  const [updateStandings, setUpdateStandings] = useState(null);
  const [serverMessage, setServerMessage] = useState("");
  const [isStateUploaded, setIsStateUploaded] = useState(false);
  const [tableToBeDisplayed, setTableToBeDisplayed] = useState("League");
  const [secondTableToBeDisplayed, setSecondTableToBeDisplayed] =
    useState("League");
  const [splitTable, setSplitTable] = useState(false);
  const [recentGameResults, setRecentGameResults] = useState([]);
  const [howManyTickers, setHowManyTickers] = useState(null);

  const fileInputRef = useRef(null);
  ///////////////////////////////////////////////////////////
  // gameType still needs to be incorporated and made dynamic
  ///////////////////////////////////////////////////////////
  const gameTypeRef = useRef(null);

  useEffect(() => {
    fetchGameData();
  }, [gameData]);

  useEffect(() => {
    getRecentGameResults(howManyTickers);
  }, [updateStandings, howManyTickers]);

  // submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const file = fileInputRef.current.files[0];

    if (!file) {
      alert("No file selected");
      return;
    }

    ///////////////////////////////////////////
    // get game type to add to game state file
    // TO BE REMOVED AND MADE DYNAMIC
    ///////////////////////////////////////////
    const gameType = gameTypeRef.current.value;
    try {
      const fetchedCSVData = [];

      if (file.name === "WN95HL_Game_Stats.csv") {
        // this returns all the parsed game data
        const fetchedGameData = await readGameStateFile(
          file,
          seasonNumber,
          gameType,
          leagueName
        );
        fetchedGameData.forEach((gameState) => fetchedCSVData.push(gameState));
        const howManyGamesSubmitted = fetchedCSVData.length;

        // declare i here so it can be passed to the catch block for error reference
        try {
          const responses = [];
          for (let i = 0; i < howManyGamesSubmitted; i++) {
            const response = await fetch(`/api/game-result`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(fetchedCSVData[i]),
            });

            if (!response.ok) {
              const responseError = await response.json();
              throw new Error(responseError.message);
            }
            setServerMessage(`${i} states prcocessed..`);
            responses.push(await response.json());
          }

          fileInputRef.current = "";
          setServerMessage(
            `${howManyGamesSubmitted} games have been submitted`
          );
          const newStandings = responses[responses.length - 1].newStandings;
          setUpdateStandings(newStandings);
        } catch (error) {
          fileInputRef.current.value = "";
          setIsStateUploaded(false);
          setServerMessage(error.message);
        }
      }

      // pattern to test filename for acceptance
      const statePattern = /[WQ]S?\d{1,3}\.state\d{1,3}/;
      if (statePattern.test(file.name)) {
        // get the teams registered to this league
        const response = await fetch(
          `/api/season-data?league=${leagueName}&season-number=${seasonNumber}&field=teamsDictCodes`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const responseError = await response.json();
          throw new Error(responseError.message);
        }

        // teamsDict is name from python file
        // object containing list of team acronyms required for game state parsing
        const teamsDict = await response.json();
        // this returns all the parsed game data
        const fetchedGameData = await readBinaryGameState(
          file,
          seasonNumber,
          gameType,
          leagueName,
          teamsDict
        );
        fetchedCSVData.push(fetchedGameData);
        setGameData(fetchedCSVData[0]);
      }
    } catch (error) {
      fileInputRef.current.value = "";
      setIsStateUploaded(false);
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
      const response = await fetch(
        `/api/league-table/reset-table?league=${leagueName}&season-number=${seasonNumber}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(response.message);
      }

      const clearedTable = await response.json();

      setServerMessage("");
      setIsStateUploaded(false);
      setUpdateStandings(clearedTable.newStandings);
    } catch (error) {
      setServerMessage(error.message);
    }
  }

  async function fetchGameData() {
    if (!gameData) {
      return;
    }
    setIsStateUploaded(true);
    // message the user request has been sent
    setServerMessage("Sending...");
    try {
      const response = await fetch(`/api/game-result`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gameData),
      });

      if (!response.ok) {
        const responseError = await response.json();
        throw new Error(responseError.message);
      }

      const responseData = await response.json();
      setServerMessage("");
      setUpdateStandings(responseData.newStandings);
    } catch (error) {
      fileInputRef.current.value = "";
      setIsStateUploaded(false);
      setServerMessage(error.message);
    }
  }

  async function getRecentGameResults() {
    try {
      // message the user request has been sent
      const response = await fetch(
        `/api/season-data?league=${leagueName}&season-number=${seasonNumber}&field=recent-results`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(response.message);
      }

      const recentGameResults = await response.json();
      setRecentGameResults(recentGameResults);
    } catch (error) {
      setServerMessage(error.message);
    }
  }

  return (
    <div
      onClick={() => {
        setIsStateUploaded(false);
      }}
    >
      <form
        className="flex flex-row justify-between w-full mt-4 bg-slate-500 mx-auto md:rounded-lg p-3 md:max-w-md"
        onSubmit={handleSubmit}
      >
        <input
          type="file"
          ref={fileInputRef}
          id="fileInput"
          name="fileInput"
          onClick={() => setServerMessage("")}
        />

        <input type="hidden" ref={gameTypeRef} name="gameType" value="season" />

        <div className="flex flex-row gap-2">
          <button className="border rounded-md border-black px-2" type="submit">
            Submit
          </button>
        </div>
      </form>

      <Boxscore
        recentGameResults={recentGameResults}
        isStateUploaded={isStateUploaded}
      />

      {serverMessage && (
        <div className="text-center text-xl mt-2">{serverMessage}</div>
      )}

      <div className="my-4 flex flex-row justify-center gap-2">
        <TableButton
          setSplitTable={setSplitTable}
          setTableToBeDisplayed={setTableToBeDisplayed}
        >
          League
        </TableButton>
        <div className="flex gap-2 lg:hidden">
          <TableButton setTableToBeDisplayed={setTableToBeDisplayed}>
            Clarence Campbell
          </TableButton>
          <TableButton setTableToBeDisplayed={setTableToBeDisplayed}>
            Prince of Wales
          </TableButton>
        </div>
        <div className="hidden lg:block">
          <TableButton
            setSplitTable={setSplitTable}
            setTableToBeDisplayed={setTableToBeDisplayed}
            setSecondTableToBeDisplayed={setSecondTableToBeDisplayed}
          >
            Conferences
          </TableButton>
        </div>
      </div>
      <div
        className={`flex flex-col ${
          splitTable ? "justify-around lg:flex-row" : ""
        }`}
      >
        <Standings
          updateStandings={updateStandings}
          setServerMessage={setServerMessage}
          leagueName={leagueName}
          seasonNumber={seasonNumber}
          tableToBeDisplayed={tableToBeDisplayed}
        />
        {splitTable && (
          <Standings
            updateStandings={updateStandings}
            setServerMessage={setServerMessage}
            leagueName={leagueName}
            seasonNumber={seasonNumber}
            secondTableToBeDisplayed={secondTableToBeDisplayed}
          />
        )}
      </div>
    </div>
  );
}

export default GameInputForm;
