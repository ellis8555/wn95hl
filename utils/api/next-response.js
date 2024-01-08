import { NextResponse } from "next/server";
import { ORIGIN } from "../constants/connections";

function nextResponse(responseMessage, statusCode, httpMethod) {
  return NextResponse.json(responseMessage, {
    status: statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": httpMethod,
    },
  });
}

export default nextResponse;
