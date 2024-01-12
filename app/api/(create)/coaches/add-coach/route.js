import { connectToDb } from "@/utils/database";
import nextResponse from "@/utils/api/next-response";
import User from "@/schemas/user";

const dbCallFrom = "api create coaches/add-coach";

export const POST = async (req) => {
  const { name } = await req.json();

  // return if no username input
  if (!name) {
    return nextResponse({ message: "A name is required.." }, 400, "POST");
  }

  try {
    await connectToDb(dbCallFrom);

    // prevent duplicate coach name
    const checkIfCoachExists = await User.queryIfUserExists(name);

    if (checkIfCoachExists) {
      return nextResponse(
        { message: "User name already exists.." },
        400,
        "POST"
      );
    }

    // create new user
    await User.createNewUser(name);

    return nextResponse({ message: `${name} has been added` }, 200, "POST");
  } catch (error) {
    return nextResponse({ message: error.message }, 500, "POST");
  }
};
