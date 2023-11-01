import { cookies } from "next/headers";
import { connectToDb } from "@/utils/database";
import { AUTH_COOKIE } from "@/utils/constants/constants";
import createToken from "@/utils/api/create-token";
import nextResponse from "@/utils/api/next-response";
import User from "@/schemas/user";

export const POST = async (req) => {
  const { name, password } = await req.json();
  const cookieStore = cookies();

  try {
    await connectToDb();

    const user = await User.login(name, password);

    const token = createToken(user._id);

    const responseCookie = cookieStore.set(AUTH_COOKIE, token, {
      path: "/",
    });

    return nextResponse(
      { message: `${user.name} you are now logged in` },
      200,
      "POST",
      responseCookie
    );
  } catch (error) {
    return nextResponse({ message: error.message }, 500, "POST");
  }
};
