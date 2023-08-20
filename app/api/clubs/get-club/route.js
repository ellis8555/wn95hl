import { connectToDb } from "@/utils/database";
import queryOneClub from "@/utils/db-queries/query-one/club/query-one-club";
import nextResponse from "@/utils/api/next-response";

let db;

export const POST = async (req) => {
  const { teamName } = await req.json();

  try {
    db = await connectToDb();

    const getClub = await queryOneClub(teamName);

    return nextResponse(getClub, 200, "POST");
  } catch (error) {
    return nextResponse({ message: error.message }, 500, "POST");
  } finally {
    if (db) {
      db.close();
    }
  }
};
