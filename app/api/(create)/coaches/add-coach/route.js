import { connectToDb } from "@/utils/database";
import queryIfUserExists from "@/utils/db-queries/query-one/user/queryIfUserExists";
import createNewUser from "@/utils/db-queries/query-one/user/createNewUser";
import nextResponse from "@/utils/api/next-response";

let db;

export const POST = async (req) => {
  const { name, isAdmin } = await req.json();

  // return if no username input
  if (!name) {
    return nextResponse({ message: "A name is required.." }, 400, "POST");
  }

  try {
    db = await connectToDb();

    // prevent duplicate coach name
    const checkIfCoachExists = await queryIfUserExists(name);

    if (checkIfCoachExists) {
      return nextResponse(
        { message: "User name already exists.." },
        400,
        "POST"
      );
    }

    // create new user
    await createNewUser(name, isAdmin);

    return nextResponse({ message: `${name} has been added` }, 200, "POST");
  } catch (error) {
    return nextResponse({ message: error.message }, 500, "POST");
  } finally {
    if (db) {
      db.close();
    }
  }
};
