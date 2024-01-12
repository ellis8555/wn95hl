import { connectToDb } from "@/utils/database";
import User from "@/schemas/user";
import nextResponse from "@/utils/api/next-response";

const dbCallFrom = "api read coaches/get-coach";

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);

  const name = searchParams.get("name");

  try {
    await connectToDb(dbCallFrom);

    const coach = await User.queryOneUser(name);

    if (!coach) {
      return nextResponse(
        { message: "That coach was not found.." },
        400,
        "GET"
      );
    }
    return nextResponse(coach, 200, "GET");
  } catch (error) {
    return nextResponse({ message: error.message }, 500, "GET");
  }
};
