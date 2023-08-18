import { connectToDb } from "@/utils/database";
import { NextResponse } from "next/server";
import queryOneUser from "@/utils/db-queries/query-one/user/queryOneUser";

let db;

export const POST = async (req) => {
  const { name } = await req.json();

  try {
    db = await connectToDb();

    const getCoach = await queryOneUser(name);

    if (!getCoach) {
      return NextResponse.json(
        { message: "That coach was not found.." },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(getCoach, {
      status: 200,
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
