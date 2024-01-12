import { connectToDb } from "@/utils/database";
import Club from "@/schemas/club";
import User from "@/schemas/user";
import nextResponse from "@/utils/api/next-response";

const dbCallFrom = "api update clubs/edit-club";

export const PATCH = async (req) => {
  const { clubName, newName, coachName, teamAcronym, teamLogo, teamBanner } =
    await req.json();

  try {
    await connectToDb(dbCallFrom);

    const club = await Club.queryOneClub(clubName);

    if (!club) {
      return nextResponse({ message: "Team does not exist.." }, 400, "PATCH");
    }

    const listOfChanges = [];

    if (coachName) {
      const coach = await User.queryOneUser(coachName);
      club.coachId = coach._id;
      listOfChanges.push("coach");
    }

    if (newName) {
      club.name = newName;
      listOfChanges.push("team name");
    }

    if (teamAcronym) {
      club.teamAcronym = teamAcronym;
      listOfChanges.push("team abbreviation");
    }

    if (teamLogo) {
      club.teamLogo = teamLogo;
      listOfChanges.push("team logo");
    }

    if (teamBanner) {
      club.teamBanner = teamBanner;
      listOfChanges.push("team banner");
    }

    // begin to construct a string that returns message to user stating what was changed
    const isPlural = listOfChanges.length > 1 ? true : false;
    let returnedMessage = "";

    const firstWord = listOfChanges[0];
    const capitalize = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);

    listOfChanges.splice(0, 1, capitalize);

    listOfChanges.forEach((field) => {
      if (isPlural) {
        returnedMessage += field + ", ";
      } else {
        returnedMessage += field + " ";
      }
    });

    if (isPlural) {
      returnedMessage += "have been changed";
    } else {
      returnedMessage += "has been changed";
    }

    await club.save();

    return nextResponse({ message: returnedMessage }, 200, "PATCH");
  } catch (error) {
    return nextResponse({ message: error.message }, 500, "PATCH");
  }
};
