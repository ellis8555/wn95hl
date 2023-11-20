import { connectToDb } from "@/utils/database";
import nextResponse from "@/utils/api/next-response";
import Club from "@/schemas/club";
import { LEAGUE_SCHEMA_SWITCH } from "@/utils/constants/data-calls/db_calls";

export const POST = async (req) => {
  let {
    teamName,
    leagueName,
    logo,
    seasonNumber: whichSeason,
    conference,
    division,
  } = await req.json();

  // if league has no divisions or conferences set defaults to league for each
  if (division === "") {
    division = "League";
  }
  if (conference === "") {
    conference = "League";
  }

  try {
    await connectToDb();

    const League = await LEAGUE_SCHEMA_SWITCH(leagueName);

    // check that team name exists
    const searchIfTeamExists = await Club.queryIfClubExists(teamName);
    if (!searchIfTeamExists) {
      return nextResponse(
        { message: "This team is not registered.." },
        400,
        "POST"
      );
    }

    // check if season has been created in the database
    let thisSeason = await League.findOne({ seasonNumber: whichSeason });
    if (!thisSeason) {
      return nextResponse(
        { message: `Season ${whichSeason} has not been registered` },
        400,
        "POST"
      );
    }

    // check if team has already been added to the season
    const teamObject = await Club.queryOneClub(teamName);
    const teamAcronym = teamObject.teamAcronym;
    const isTeamRegistered = thisSeason.teams.find(
      (team) => team.teamAcronym === teamAcronym
    );

    if (isTeamRegistered) {
      return nextResponse(
        {
          message: "Team is already registered for this season",
        },
        400,
        "POST"
      );
    }

    // check if the conference exists
    // get array of conference objects
    const conferenceList = thisSeason.conferences;
    // begin search with conference not found
    let isConferenceValid = false;
    // loop through leagues conferences and set isConferenceValid true if teams conference is in leagues conference array
    conferenceList.forEach((conf) => {
      if (conf.name === conference) {
        isConferenceValid = true;
      }
    });
    // const isConferenceValid = conferenceList.includes(conference);
    if (!isConferenceValid) {
      return nextResponse({
        message: `${conference} conference is not registered to this league`,
      });
    }

    // check if the division exists
    const divisionList = thisSeason.divisions;
    const isDivisionValid = divisionList.includes(division);
    if (!isDivisionValid) {
      return nextResponse({
        message: `The ${division} division is not registered to this league`,
      });
    }

    //////////////////////////////////////////////////////
    // set schedules for teams to reflect newly added team
    //////////////////////////////////////////////////////

    // divide by 2 to set home and away games
    const gamesVsDivision = +thisSeason.divisionalGames / 2;
    const gamesVsConference = +thisSeason.conferenceGames / 2;
    const gamesVsOtherConference = +thisSeason.otherConferenceGames / 2;

    // add seasonNumber
    thisSeason.seasonNumber = whichSeason;

    const createTeamsObject = {
      teamAcronym,
      logo,
      conference,
      division,
      schedule: {
        home: [],
        away: [],
      },
    };

    // get current teams registered in the league
    const currentTeamsList = thisSeason.teams;

    // current total games to be played for this new team set to 0
    // will be incremented within if check to follow
    let teamsTotalGamesToBePlayed = 0;

    // update leagues total games to be played
    let currentTotalGamesToPlayedInTheLeague = +thisSeason.totalGamesToBePlayed;

    // assign home and away games vs each team
    if (currentTeamsList.length > 0) {
      currentTeamsList.map((registeredTeam) => {
        if (registeredTeam.division === division) {
          teamsTotalGamesToBePlayed += +thisSeason.divisionalGames;
          for (let i = 1; i <= gamesVsDivision; i++) {
            registeredTeam.schedule.home.push(teamAcronym);
            registeredTeam.schedule.away.push(teamAcronym);
            createTeamsObject.schedule.home.push(registeredTeam.teamAcronym);
            createTeamsObject.schedule.away.push(registeredTeam.teamAcronym);
          }
        } else if (registeredTeam.conference === conference) {
          teamsTotalGamesToBePlayed += +thisSeason.conferenceGames;
          for (let i = 1; i <= gamesVsConference; i++) {
            registeredTeam.schedule.home.push(teamAcronym);
            registeredTeam.schedule.away.push(teamAcronym);
            createTeamsObject.schedule.home.push(registeredTeam.teamAcronym);
            createTeamsObject.schedule.away.push(registeredTeam.teamAcronym);
          }
        } else {
          teamsTotalGamesToBePlayed += +thisSeason.otherConferenceGames;
          for (let i = 1; i <= gamesVsOtherConference; i++) {
            registeredTeam.schedule.home.push(teamAcronym);
            registeredTeam.schedule.away.push(teamAcronym);
            createTeamsObject.schedule.home.push(registeredTeam.teamAcronym);
            createTeamsObject.schedule.away.push(registeredTeam.teamAcronym);
          }
        }
      });
      const updatedTotalGamesToBePlayed =
        currentTotalGamesToPlayedInTheLeague + teamsTotalGamesToBePlayed;

      // updates the db total games to be played
      thisSeason.totalGamesToBePlayed = updatedTotalGamesToBePlayed;
      thisSeason.markModified("totalGamesToBePlayed");
    }

    // add team name to list of teams array
    thisSeason.teams.push(createTeamsObject);

    // add team to the standings array

    thisSeason.standings.push({
      teamName: teamName,
      teamAcronym: teamAcronym,
      teamLogo: logo,
    });

    // recreate teamsDictCodes essential for team positions within any custom game ROM
    const tempTeamAcronymsArray = [];
    currentTeamsList.forEach((team) => {
      tempTeamAcronymsArray.push(team.teamAcronym);
    });
    // sort the array to match ROM order which is alpabetical
    tempTeamAcronymsArray.sort();
    for (let i = 0; i < currentTeamsList.length; i++) {
      thisSeason.teamsDictCodes[i] = tempTeamAcronymsArray[i];
    }
    thisSeason.markModified("teamsDictCodes");

    // update the seasons document
    await thisSeason.save();

    return nextResponse(
      {
        message: `Team has been added to season ${whichSeason} of the ${leagueName}`,
      },
      200,
      "POST"
    );
  } catch (error) {
    return nextResponse({ message: error.message }, 500, "POST");
  }
};
