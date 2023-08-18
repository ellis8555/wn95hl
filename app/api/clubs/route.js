import { connectToDb } from "@/utils/database";
import { NextResponse } from "next/server";
import queryClubs from "@/utils/db-queries/query-all/clubs/query-clubs";

let db;

export const GET = async () => {
  try {
    db = await connectToDb();

    const teams = await queryClubs();

    return NextResponse.json(teams, {
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
