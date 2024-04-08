import { connectToDb } from "@/utils/database";
import nextResponse from "@/utils/api/next-response";
import Club from "@/schemas/club";

const dbCallFrom = "create api club/add-club";

export const POST = async (req) => {
  const { name, nickname, teamAcronym, teamLogo, teamBanner } =
    await req.json();

  try {
    await connectToDb(dbCallFrom);

    // prevent duplicate name from being added
    const searchForIfTeamExists = await Club.queryIfClubExists(name, nickname);
    if (searchForIfTeamExists) {
      return nextResponse(
        { message: "This team's city and name are already taken..." },
        400,
        "POST" 
      );
    }

    const addClub = await new Club({
      name,
      nickname,
      teamAcronym,
      teamLogo,
      teamBanner,
    });
    await addClub.save();

    return nextResponse(
      { message: `The ${name} ${nickname} have been added` },
      200,
      "POST"
    );
  } catch (error) {
    return nextResponse({ message: error.message }, 500, "POST");
  }
};
