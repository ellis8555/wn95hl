import { connectToDb } from "@/utils/database";
import nextResponse from "@/utils/api/next-response";
import User from "@/schemas/user";

export const GET = async () => {
  try {
    await connectToDb();

    const users = await User.queryAllUsers();

    return nextResponse(users, 200, "GET");
  } catch (error) {
    return nextResponse({ message: error.message }, 500, "GET");
  }
};
