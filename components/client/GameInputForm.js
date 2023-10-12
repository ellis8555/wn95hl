// gameData is the var that contains all of a game states data
"use client";

import { useRef, useState, useEffect } from "react";
import { useFullLeagueStandings } from "@/context/FullLeagueStandingsContext";
import readGameStateFile from "@/utils/game-state-parsing/CSV-game-state/read-game-state-file";
import readBinaryGameState from "@/utils/game-state-parsing/game-state/read-game-state";
import { DOMAIN } from "@/utils/constants/connections";

function GameInputForm({ leagueName, seasonNumber }) {
  const [gameData, setGameData] = useState(null);
  const [serverMessage, setServerMessage] = useState("");
  const [isStateUploaded, setIsStateUploaded] = useState(false);

  const { setClientSideStandings, setRefreshTheStandings } =
    useFullLeagueStandings();

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
          // update the standings table after submitting game result
          const standingsResponse = await fetch(
            `${DOMAIN}/api/league-data/${leagueName}/${seasonNumber}`,
            {
              next: {
                revalidate: 0,
              },
            }
          );

          if (!standingsResponse.ok) {
            const errorMessage = await standingsResponse.json();
            throw new Error(errorMessage.message);
          }

          const leagueData = await standingsResponse.json();
          const { standings: updatedStandings } = leagueData;

          setRefreshTheStandings(true);
          setClientSideStandings(updatedStandings);
        } catch (error) {
          fileInputRef.current.value = "";
          setIsStateUploaded(false);
          setServerMessage(error.message);
        }
      }

      ///////////////////////////////////////////////
      // temp fix for unexpected file name
      // ' || fileName.includes('2002TD') is temp
      // only 2002TD file accepted till new season
      ///////////////////////////////////////////////

      // pattern to test filename for acceptance
      // const statePattern = /[WQ]S?\d{1,3}\.state\d{1,3}/;
      // if (statePattern.test(fileName) || fileName.includes("2002TD")) {
      if (fileName.includes("2002TD")) {
        // get the teams registered to this league
        const response = await fetch(
          `${DOMAIN}/api/league-data/${leagueName}/${seasonNumber}/team-codes`,
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
        const leagueData = await response.json();
        const { dictCodes } = leagueData;
        // this returns all the parsed game data
        const fetchedGameData = await readBinaryGameState(
          file,
          seasonNumber,
          gameType,
          leagueName,
          dictCodes
        );
        fetchedCSVData.push(fetchedGameData);
        setGameData(fetchedCSVData[0]);
      } else {
        setServerMessage("File name is not associated with a league yet");
      }
    } catch (error) {
      fileInputRef.current.value = "";
      setIsStateUploaded(false);
      setServerMessage(error.message);
    }

    if (fileInputRef.current != "") {
      fileInputRef.current.value = "";
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
      // edit user message
      setServerMessage("Updating the standings...");
      // update the standings table after submitting game result
      const standingsResponse = await fetch(
        `${DOMAIN}/api/league-data/${leagueName}/${seasonNumber}`,
        {
          next: {
            revalidate: 0,
          },
        }
      );

      if (!standingsResponse.ok) {
        const errorMessage = await standingsResponse.json();
        throw new Error(errorMessage.message);
      }

      const leagueData = await standingsResponse.json();
      const { standings: updatedStandings } = leagueData;

      setRefreshTheStandings(true);
      setClientSideStandings(updatedStandings);
      setServerMessage("");
    } catch (error) {
      fileInputRef.current.value = "";
      setIsStateUploaded(false);
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

      {serverMessage && (
        <div className="text-center text-rose-800 text-xl mt-2">
          {serverMessage}
        </div>
      )}
    </div>
  );
}

export default GameInputForm;
