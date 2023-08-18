import { connectToDb } from "@/utils/database";
import { NextResponse } from "next/server";
import queryIfUserExists from "@/utils/db-queries/query-one/user/queryIfUserExists";
import createNewUser from "@/utils/db-queries/query-one/user/createNewUser";

let db;

export const POST = async (req) => {
  const { name } = await req.json();

  // return if no username input
  if (!name) {
    return NextResponse.json(
      { message: "A name is required.." },
      {
        status: 400,
      }
    );
  }

  try {
    db = await connectToDb();

    // prevent duplicate coach name
    const checkIfCoachExists = await queryIfUserExists(name);

    if (checkIfCoachExists) {
      return NextResponse.json(
        { message: "User name already exists.." },
        {
          status: 400,
        }
      );
    }

    // create new user
    const newUser = await createNewUser(name);

    return NextResponse.json(newUser, {
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
