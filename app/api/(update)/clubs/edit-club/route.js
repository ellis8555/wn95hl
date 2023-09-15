import { connectToDb } from "@/utils/database";
import queryOneClub from "@/utils/db-queries/query-one/club/query-one-club";
import queryOneUser from "@/utils/db-queries/query-one/user/queryOneUser";
import nextResponse from "@/utils/api/next-response";

let db;

export const PATCH = async (req) => {
  const { clubName, newName, coachName, teamAcronym, teamLogo, teamBanner } =
    await req.json();

  try {
    db = await connectToDb();

    const club = await queryOneClub(clubName);

    if (!club) {
      return nextResponse({ message: "Team does not exist.." }, 400, "PATCH");
    }

    const listOfChanges = [];

    if (coachName) {
      const coach = await queryOneUser(coachName);
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
  } finally {
    if (db) {
      db.close();
    }
  }
};
