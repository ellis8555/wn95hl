import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import nextResponse from "@/utils/api/next-response";

export async function GET() {
  const cookieStore = cookies();

  const token = cookieStore.get("userAuth");

  if (!token) {
    return nextResponse({ message: "Unauthorized" }, 400, "GET");
  }

  const { value } = token;
  const secret = process.env.SECRET_KEY;

  try {
    const user = verify(value, secret);

    return nextResponse({ message: `User id: ${user._id}` }, 200, "GET");
  } catch (error) {
    return nextResponse({ message: "Not authorized" }, 400, "GET");
  }
}
