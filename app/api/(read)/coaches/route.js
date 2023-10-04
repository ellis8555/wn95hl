import { connectToDb } from "@/utils/database";
import nextResponse from "@/utils/api/next-response";
import User from "@/schemas/user";

let db;

export const GET = async () => {
  try {
    db = await connectToDb();

    const users = await User.queryAllUsers();

    return nextResponse(users, 200, "GET");
  } catch (error) {
    return nextResponse({ message: error.message }, 500, "GET");
  } finally {
    if (db) {
      db.close();
    }
  }
};
