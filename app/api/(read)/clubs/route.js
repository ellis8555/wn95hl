import { connectToDb } from "@/utils/database";
import Club from "@/schemas/club";
import nextResponse from "@/utils/api/next-response";

const dbCallFrom = "api read clubs";

export const GET = async () => {
  try {
    await connectToDb(dbCallFrom);

    const teams = await Club.queryAllClubs();

    return nextResponse(teams, 200, "GET");
  } catch (error) {
    return nextResponse({ message: error.message }, 500, "GET");
  }
};
