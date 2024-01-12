import { connectToDb } from "@/utils/database";
import nextResponse from "@/utils/api/next-response";
import Club from "@/schemas/club";
import User from "@/schemas/user";

const dbCallFrom = "create api club/add-club";

export const POST = async (req) => {
  const { name, nickname, teamAcronym, coachName, teamLogo, teamBanner } =
    await req.json();

  try {
    await connectToDb(dbCallFrom);

    // prevent duplicate name from being added
    const searchForIfTeamExists = await Club.queryIfClubExists(name);
    if (searchForIfTeamExists) {
      return nextResponse(
        { message: "This team name is taken.." },
        400,
        "POST"
      );
    }

    const getCoachDocument = await User.queryOneUser(coachName);
    const coachId = getCoachDocument._id;
    const addClub = await new Club({
      name,
      nickname,
      teamAcronym,
      coachId,
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
