import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/utils/constants/constants";
import nextResponse from "@/utils/api/next-response";

export const GET = async () => {
  const cookieStore = cookies();

  try {
    const responseCookie = cookieStore.delete(AUTH_COOKIE);

    return nextResponse(
      { message: "Successfully logged out" },
      200,
      "GET",
      responseCookie
    );
  } catch (error) {
    return nextResponse({ message: "Error logging out" }, 500, "GET");
  }
};
