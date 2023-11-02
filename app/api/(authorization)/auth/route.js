import { verify } from "jsonwebtoken";
import { AUTH_COOKIE } from "@/utils/constants/constants";
import nextResponse from "@/utils/api/next-response";

export const GET = async (request) => {
  const token = request.cookies.get(AUTH_COOKIE);

  try {
    const { value } = token;
    const secret = process.env.SECRET_KEY;
    const user = verify(value, secret);
    return nextResponse({ message: `User id: ${user._id}` }, 200, "GET");
  } catch (error) {
    return nextResponse({ message: "Not authorized" }, 400, "GET");
  }
};
