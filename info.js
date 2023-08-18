// import { connectToDb } from "@/utils/database";
// import GameResult from "@/schemas/gameResult";
// import Club from "@/schemas/club";
// import User from "@/schemas/user";

export const POST = async (req) => {
  const { homeTeam } = await req.json();
  //   const gameFile = excel.readFile("./data/game1.xlsx");

  //   const gameData = gameFile.Sheets.Game1;

  //   const homeTeam = gameData.A2.v;
  //   const awayTeam = gameData.A3.v;

  //   const homeScore = gameData.B2.v;
  //   const awayScore = gameData.B3.v;

  console.log(homeTeam);
  //   try {
  // await connectToDb();
  // const homeTeamRef = await Club.findOne({ name: homeTeam });
  // const awayTeamRef = await Club.findOne({ name: awayTeam });
  // const homeTeamCoach = await User.findOne({ _id: homeTeamRef.coach });
  // const awayTeamCoach = await User.findOne({ _id: awayTeamRef.coach });
  // const addGameDocument = await new GameResult({
  //   home_team: homeTeam,
  //   away_team: awayTeam,
  //   home_team_score: homeScore,
  //   away_team_score: awayScore,
  //   coach_home_team: homeTeamCoach.name,
  //   coach_away_team: awayTeamCoach.name,
  // });
  // await addGameDocument.save();
  // return new Response(addGameDocument, {
  //   status: 200,
  // });
  //   } catch (error) {
  //     return new Response(error, {
  //       status: 500,
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //   }
};
