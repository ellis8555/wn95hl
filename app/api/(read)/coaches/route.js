import { connectToDb } from "@/utils/database";
import nextResponse from "@/utils/api/next-response";
import User from "@/schemas/user";

const dbCallFrom = "api read coaches";

export const GET = async () => {
  try {
    await connectToDb(dbCallFrom);

    const users = await User.queryAllUsers();

    return nextResponse(users, 200, "GET");
  } catch (error) {
    return nextResponse({ message: error.message }, 500, "GET");
  }
};
