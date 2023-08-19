import { connectToDb } from "@/utils/database";
import { NextResponse } from "next/server";
import getSeasonsModel from "@/schemas/season/season";

let db;

export const GET = async (req, res) => {
  try {
    db = await connectToDb();

    const SeasonModel = getSeasonsModel("8");
    const seasonData = await SeasonModel.find({});

    return NextResponse.json(seasonData, {
      status: 200,
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      {
        status: 500,
        mode: "no-cors",
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
