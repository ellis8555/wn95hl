import { NextResponse } from "next/server";

function nextResponseHTMX(responseMessage, statusCode, httpMethod) {
  return new NextResponse(responseMessage, {
    status: statusCode,
    headers: {
      "Content-Type": "text/html",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": httpMethod,
    },
  });
}

export default nextResponseHTMX;
