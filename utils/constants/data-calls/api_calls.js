import { DOMAIN } from "../connections";

export const SUBMIT_GAME_RESULT = async (gameData) => {
  const url = `${DOMAIN}/api/game-result`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(gameData),
  });

  if (!response.ok) {
    const responseError = await response.json();
    return new Error(responseError.message);
  }

  return response;
};

export const GET_LEAGUE_DATA = async (leagueName, seasonNumber, ...fields) => {
  let fieldsToGet = "";

  fields.forEach((field) => {
    fieldsToGet += `/${field}`;
  });
  const url = `${DOMAIN}/api/league-data/${leagueName}/${seasonNumber}${fieldsToGet}`;
  const leagueData = await fetch(url, {
    next: {
      revalidate: 0,
    },
  });

  if (!leagueData.ok) {
    const errorMessage = await leagueData.json();
    return new Error(errorMessage.message);
  }

  return leagueData;
};
