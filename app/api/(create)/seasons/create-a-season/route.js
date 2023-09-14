import { connectToDb } from "@/utils/database";
import nextResponse from "@/utils/api/next-response";
import getSeasonsModel from "@/schemas/season/season";

let db;

export const POST = async (req) => {
  const {
    leagueName,
    seasonNumber,
    conferences,
    divisions,
    gamesVsDivision,
    gamesVsConference,
    gamesVsOtherConference,
  } = await req.json();

  try {
    db = await connectToDb();

    // search if season number has already been used or is not a number
    const numbersOnlyPattern = /^\d+$/;
    const isSeasonNumberValid = numbersOnlyPattern.test(+seasonNumber);

    if (!isSeasonNumberValid) {
      return nextResponse(
        { message: "Season number needs to be a number" },
        400,
        "POST"
      );
    }

    const Season = getSeasonsModel(leagueName);
    const doesSeasonNumberAlreadyExist = await Season.findOne({
      seasonNumber: seasonNumber,
    });
    if (doesSeasonNumberAlreadyExist) {
      return nextResponse(
        {
          message: "Season already exists. Use a new number",
        },
        400,
        "POST"
      );
    }

    // test games vs is a numerical character
    const isGamesVsDivisionValid = numbersOnlyPattern.test(+gamesVsDivision);
    const isGamesVsConferenceValid = numbersOnlyPattern.test(
      +gamesVsConference
    );
    const isGamesVsOtherConferenceValid = numbersOnlyPattern.test(
      +gamesVsOtherConference
    );
    if (
      !isGamesVsDivisionValid ||
      !isGamesVsConferenceValid ||
      !isGamesVsOtherConferenceValid
    ) {
      return nextResponse(
        { message: "Games vs opponents needs to be numerical" },
        400,
        "POST"
      );
    }

    const newSeason = await new Season({
      seasonNumber: seasonNumber,
      conferences: conferences,
      divisions: divisions,
      divisionalGames: gamesVsDivision,
      conferenceGames: gamesVsConference,
      otherConferenceGames: gamesVsOtherConference,
    });

    await newSeason.save();

    return nextResponse(
      { message: `Season ${seasonNumber} has been created` },
      200,
      "POST"
    );
  } catch (error) {
    return nextResponse({ message: error.message }, 500, "POST");
  } finally {
    if (db) {
      db.close();
    }
  }
};
