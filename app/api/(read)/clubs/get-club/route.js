import { connectToDb } from "@/utils/database";
import Club from "@/schemas/club";
import nextResponse from "@/utils/api/next-response";

const dbCallFrom = "api read clubs/get-club";

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);

  const teamName = searchParams.get("team-name");

  try {
    await connectToDb(dbCallFrom);

    const getClub = await Club.queryOneClub(teamName);

    return nextResponse(getClub, 200, "GET");
  } catch (error) {
    return nextResponse({ message: error.message }, 500, "GET");
  }
};
