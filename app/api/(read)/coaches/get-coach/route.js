import { connectToDb } from "@/utils/database";
import User from "@/schemas/user";
import nextResponse from "@/utils/api/next-response";

let db;

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);

  const name = searchParams.get("name");

  try {
    db = await connectToDb();

    const getCoach = await User.queryOneUser(name);

    if (!getCoach) {
      return nextResponse(
        { message: "That coach was not found.." },
        400,
        "POST"
      );
    }

    return nextResponse(getCoach, 200, "POST");
  } catch (error) {
    return nextResponse({ message: error.message }, 500, "POST");
  } finally {
    if (db) {
      db.close();
    }
  }
};
