import { connectToDb } from "@/utils/database";
import queryOneClub from "@/utils/db-queries/query-one/club/query-one-club";
import nextResponse from "@/utils/api/next-response";

let db;

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);

  const teamName = searchParams.get("team-name");

  try {
    db = await connectToDb();

    const getClub = await queryOneClub(teamName);

    return nextResponse(getClub, 200, "GET");
  } catch (error) {
    return nextResponse({ message: error.message }, 500, "GET");
  } finally {
    if (db) {
      db.close();
    }
  }
};
