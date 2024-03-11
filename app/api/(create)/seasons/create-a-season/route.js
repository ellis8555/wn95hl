import { connectToDb } from "@/utils/database";
import nextResponse from "@/utils/api/next-response";
import { LEAGUE_SCHEMA_SWITCH } from "@/utils/constants/data-calls/db_calls";

const dbCallFrom = "api create seasons/create-a-season";

export const POST = async (req) => {
  let {
    leagueName,
    seasonNumber,
    conferences,
    divisions,
    gamesVsDivision,
    gamesVsConference,
    // if league has no divisions, conferences set gamesVsOtherConference to games played in order for proper schedule to be created
    gamesVsOtherConference,
  } = await req.json();

  // if league does not have divisions set default conference
  if (divisions.length == 0) {
    divisions.push("League");
  }
  // if league does not have conferences set default conference
  if (conferences.length == 0) {
    conferences.push({
      name: "League",
      logo: "NHL95onlineBANNER",
    });
  }
  // if league does not have divisions then set the minimum games vs other teams to 2
  if (gamesVsDivision === "") {
    gamesVsDivision = 0;
  }
  // if league does not have conferences then set games vs conferences to zero
  if (gamesVsConference === "") {
    gamesVsConference = 0;
  }
  if (gamesVsOtherConference === "") {
    gamesVsOtherConference = 0;
  }

  const numbersOnlyPattern = /^\d+$/;

  // test games vs is a numerical character

  const isGamesVsDivisionValid = numbersOnlyPattern.test(+gamesVsDivision);
  const isGamesVsConferenceValid = numbersOnlyPattern.test(+gamesVsConference);
  const isGamesVsOtherConferenceValid = numbersOnlyPattern.test(
    +gamesVsOtherConference
  );

  if (
    !isGamesVsDivisionValid ||
    !isGamesVsConferenceValid ||
    !isGamesVsOtherConferenceValid
  ) {
    return nextResponse(
      {
        message:
          "Games vs opponents needs to be numerical. Blank is ok and will be set to zero",
      },
      400,
      "POST"
    );
  }

  // ensure games vs is even number of games. response sent if number is odd
  if (
    gamesVsDivision % 2 !== 0 ||
    gamesVsConference % 2 !== 0 ||
    gamesVsOtherConference % 2 !== 0
  ) {
    return nextResponse(
      { message: "currently only even numbered games vs opponents works" },
      400,
      "POST"
    );
  }

  try {
    await connectToDb(dbCallFrom);

    const League = await LEAGUE_SCHEMA_SWITCH(leagueName);

    // search if season number has already been used or is not a number
    const isSeasonNumberValid = numbersOnlyPattern.test(+seasonNumber);

    if (!isSeasonNumberValid) {
      return nextResponse(
        { message: "Season number needs to be a number" },
        400,
        "POST"
      );
    }
    const doesSeasonNumberAlreadyExist = await League.findOne({
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

    const newSeason = new League({
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
  }
};
