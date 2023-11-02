import { DOMAIN } from "../connections";

// 1. GET_LEAGUE_DATA
// 2. GET_API_WITH_PARAMS
// 3. POST_JSON_TO_API
// 4. GET_API

///////////////////
// GET_LEAGUE_DATA
///////////////////
export const GET_LEAGUE_DATA = async (leagueName, seasonNumber, ...fields) => {
  let fieldsToGet = "";

  fields.forEach((field) => {
    fieldsToGet += `/${field}`;
  });
  const url = `${DOMAIN}/api/league-data/${leagueName}/${seasonNumber}${fieldsToGet}`;
  const response = await fetch(url, {
    next: {
      revalidate: 0,
    },
  });

  if (!response.ok) {
    const errorMessage = await response.json();
    return new Error(errorMessage.message);
  }

  const responseData = await response.json();

  return responseData;
};

//////////////////////
// GET_API_WITH_PARAMS
//////////////////////
export const GET_API_WITH_PARAMS = async (segments, params) => {
  const url = `${DOMAIN}/api/${segments}?${params}`;
  const response = await fetch(url);

  if (!response.ok) {
    const errorMessage = await response.json();
    return new Error(errorMessage.message);
  }

  const responseData = await response.json();

  return await responseData;
};

///////////////////
// POST_JSON_TO_API
///////////////////
export async function POST_JSON_TO_API(segments, body) {
  const url = `${DOMAIN}/api/${segments}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorMessage = await response.json();
    return new Error(errorMessage.message);
  }

  const responseData = await response.json();

  return responseData;
}

////////////
// GET_API
////////////
export const GET_API = async (segments) => {
  const url = `${DOMAIN}/api/${segments}`;
  const response = await fetch(url);

  if (!response.ok) {
    const errorMessage = await response.json();
    return new Error(errorMessage.message);
  }

  const responseData = await response.json();

  return await responseData;
};
