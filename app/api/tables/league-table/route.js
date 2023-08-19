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
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "https://tiny-lokum-ab0acc.netlify.app",
        "Access-Control-Allow-Methods": "GET",
      },
      cache: "no-store",
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin":
            "https://tiny-lokum-ab0acc.netlify.app",
          "Access-Control-Allow-Methods": "GET",
        },
      }
    );
  } finally {
    if (db) {
      db.close();
    }
  }
};
