import { NextResponse } from "next/server";
import { ORIGIN } from "../constants";

function nextResponse(responseMessage, statusCode, httpMethod, cookie = null) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": ORIGIN,
    "Access-Control-Allow-Methods": httpMethod,
  };

  // If a cookie is provided, add it to the headers
  if (cookie) {
    headers["Set-Cookie"] = cookie;
  }

  return NextResponse.json(responseMessage, {
    status: statusCode,
    headers,
  });
}

export default nextResponse;
