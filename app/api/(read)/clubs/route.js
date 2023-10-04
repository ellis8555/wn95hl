import { connectToDb } from "@/utils/database";
import Club from "@/schemas/club";
import nextResponse from "@/utils/api/next-response";

let db;

export const GET = async () => {
  try {
    db = await connectToDb();

    const teams = await Club.queryAllClubs();

    return nextResponse(teams, 200, "GET");
  } catch (error) {
    return nextResponse({ message: error.message }, 500, "GET");
  } finally {
    if (db) {
      db.close();
    }
  }
};
