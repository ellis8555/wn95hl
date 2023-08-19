import { connectToDb } from "@/utils/database";
import queryAllUsers from "@/utils/db-queries/query-all/users/queryAllUsers";
import nextResponse from "@/utils/api/next-response";

let db;

export const GET = async () => {
  try {
    db = await connectToDb();

    const users = await queryAllUsers();

    return nextResponse(users, 200, "GET");
  } catch (error) {
    return nextResponse({ message: error.message }, 500, "GET");
  } finally {
    if (db) {
      db.close();
    }
  }
};
