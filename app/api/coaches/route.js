import { connectToDb } from "@/utils/database";
import { NextResponse } from "next/server";
import queryAllUsers from "@/utils/db-queries/query-all/users/queryAllUsers";

let db;

export const GET = async () => {
  try {
    db = await connectToDb();

    const users = await queryAllUsers();

    return NextResponse.json(users, {
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
