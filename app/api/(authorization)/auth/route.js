import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { AUTH_COOKIE } from "@/utils/constants/constants";
import nextResponse from "@/utils/api/next-response";

export async function GET() {
  const cookieStore = cookies();

  const token = cookieStore.get(AUTH_COOKIE);

  if (!token) {
    return nextResponse({ message: "Unauthorized" }, 400, "GET");
  }

  const { value } = token;
  const secret = process.env.NEXT_PUBLIC_REACT_APP_SECRET_KEY;

  try {
    const user = verify(value, secret);

    return nextResponse({ message: `User id: ${user._id}` }, 200, "GET");
  } catch (error) {
    return nextResponse({ message: "Not authorized" }, 400, "GET");
  }
}
