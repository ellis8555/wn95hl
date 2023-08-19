import { NextResponse } from "next/server";

function nextResponse(responseMessage, statusCode, httpMethod) {
  return NextResponse.json(responseMessage, {
    status: statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": process.env.ALLOW_ORIGIN,
      "Access-Control-Allow-Methods": httpMethod,
    },
  });
}

export default nextResponse;
