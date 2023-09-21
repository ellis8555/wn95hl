import { NextResponse } from "next/server";

function nextResponse(responseMessage, statusCode, httpMethod, cookie = null) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": process.env.ALLOW_ORIGIN,
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
