import { connectToDb } from "@/utils/database";
import { NextResponse } from "next/server";
import queryOneClub from "@/utils/db-queries/query-one/club/query-one-club";

let db;

export const POST = async (req) => {
  const { teamName } = await req.json();

  try {
    db = await connectToDb();

    const getClub = await queryOneClub(teamName);

    return NextResponse.json(getClub, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } finally {
    if (db) {
      db.close();
    }
  }
};
