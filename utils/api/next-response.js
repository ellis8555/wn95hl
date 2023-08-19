import { NextResponse } from "next/server";

function nextResponse(responseMessage, statusCode, httpMethod, cacheType) {
  const responseConfig = {
    status: statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": process.env.ALLOW_ORIGIN,
      "Access-Control-Allow-Methods": httpMethod,
    },
  };

  // Check if cacheType is provided and not null or undefined
  if (cacheType !== undefined && cacheType !== null) {
    responseConfig.cache = cacheType;
  }

  return NextResponse.json({ message: responseMessage }, responseConfig);
}

export default nextResponse;
