import { connectToDb } from "@/utils/database";
import createToken from "@/utils/api/create-token";
import nextResponse from "@/utils/api/next-response";
import User from "@/schemas/user";

export const POST = async (req) => {
  const { name, password } = await req.json();

  try {
    await connectToDb();

    const user = await User.changePassword(name, password);

    const token = createToken(user._id);

    return nextResponse(
      { message: "Password has been changed", token },
      200,
      "POST"
    );
  } catch (error) {
    return nextResponse({ message: error.message }, 500, "POST");
  }
};
