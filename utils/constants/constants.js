export const LEAGUE_TABLE_CATEGORIES = ["GP", "W", "L", "T", "OTL", "Pts", "Gf", "Ga", "Diff", "Strk"];
export const LEAGUE_HTMX_TABLE_CATEGORIES = [
  "Team",
  "GP",
  "W",
  "L",
  "T",
  "OTL",
  "Pts",
  "Gf",
  "Ga",
  "Diff",
  "Strk"
];

export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// name of cookie for authorization
export const AUTH_COOKIE = "userAuth";

export const DEFAULT_LEAGUE = "w";

export const MOST_RECENT_SEASON = "4";

export const MOST_RECENT_Q_SEASON = "89";

export const MOST_RECENT_V_SEASON = "";

export const HOW_MANY_GAME_RESULTS = 8;

export const STATE_PATTERN = /[WQV][SP]?\d{1,3}\.state\d{1,3}/;

// used as header list for csv stats that are used for google sheets standings
export const CSV_HEADERS = `Matchup,HomeTeam,AwayTeam,AwaySHOTS,AwayPENALTIES,AwayPIM,AwayATTACK,AwayGOALS,AwayFACEOFFS WON,AwayCHECKS,AwayPASS ATT,AwayPASS COMP,AwayPP MIN,AwayPP GOALS,AwayPP OPP,AwayPP SHOTS,AwaySHG,AwayBREAKAWAY,AwayBREAKAWAY GOALS,Away1X ATT,Away1X GOALS,AwayPENALTY SHOTS,AwayPENALTY SHOT GOALS,Away1ST SHOTS,Away2ND SHOTS,Away3RD SHOTS,AwayOT SHOTS,Away1ST GOALS,Away2ND GOALS,Away3RD GOALS,AwayOT GOALS,HomeSHOTS,HomePENALTIES,HomePIM,HomeATTACK,AWayGOALS,HomeFACEOFFS WON,HomeCHECKS,HomePASS ATT,HomePASS COMP,HomePP MIN,HomePP GOALS,HomePP OPP,HomePP SHOTS,HomeSHG,HomeBREAKAWAY,HomeBREAKAWAY GOALS,Home1X ATT,Home1X GOALS,HomePENALTY SHOTS,HomePENALTY SHOT GOALS,Home1ST SHOTS,Home2ND SHOTS,Home3RD SHOTS,HomeOT SHOTS,Home1ST GOALS,Home2ND GOALS,Home3RD GOALS,HomeOT GOALS,TOTAL FO,OT Game,GAME LENGTH,Name,Pos,G,A,PTS,SO,GA,SV,SH,SV%,W,L,T,OTL,TOI,Name,Pos,G,A,PTS,SO,GA,SV,SH,SV%,W,L,T,OTL,TOI,Name,Pos,G,A,PTS,SOG,CHK,PIM,PPP,SHP,TOI,Name,Pos,G,A,PTS,SOG,CHK,PIM,PPP,SHP,TOI,Name,Pos,G,A,PTS,SOG,CHK,PIM,PPP,SHP,TOI,Name,Pos,G,A,PTS,SOG,CHK,PIM,PPP,SHP,TOI,Name,Pos,G,A,PTS,SOG,CHK,PIM,PPP,SHP,TOI,Name,Pos,G,A,PTS,SOG,CHK,PIM,PPP,SHP,TOI,Name,Pos,G,A,PTS,SOG,CHK,PIM,PPP,SHP,TOI,Name,Pos,G,A,PTS,SOG,CHK,PIM,PPP,SHP,TOI,Name,Pos,G,A,PTS,SOG,CHK,PIM,PPP,SHP,TOI,Name,Pos,G,A,PTS,SOG,CHK,PIM,PPP,SHP,TOI,Name,Pos,G,A,PTS,SO,GA,SV,SH,SV%,W,L,T,OTL,TOI,Name,Pos,G,A,PTS,SO,GA,SV,SH,SV%,W,L,T,OTL,TOI,Name,Pos,G,A,PTS,SOG,CHK,PIM,PPP,SHP,TOI,Name,Pos,G,A,PTS,SOG,CHK,PIM,PPP,SHP,TOI,Name,Pos,G,A,PTS,SOG,CHK,PIM,PPP,SHP,TOI,Name,Pos,G,A,PTS,SOG,CHK,PIM,PPP,SHP,TOI,Name,Pos,G,A,PTS,SOG,CHK,PIM,PPP,SHP,TOI,Name,Pos,G,A,PTS,SOG,CHK,PIM,PPP,SHP,TOI,Name,Pos,G,A,PTS,SOG,CHK,PIM,PPP,SHP,TOI,Name,Pos,G,A,PTS,SOG,CHK,PIM,PPP,SHP,TOI,Name,Pos,G,A,PTS,SOG,CHK,PIM,PPP,SHP,TOI,Name,Pos,G,A,PTS,SOG,CHK,PIM,PPP,SHP,TOI,Goal#,Period,TIME,TEAM,GOALscorer,ASSIST 1,ASSIST 2,TYPE,Goal#,Period,TIME,TEAM,GOALscorer,ASSIST 1,ASSIST 2,TYPE,Goal#,Period,TIME,TEAM,GOALscorer,ASSIST 1,ASSIST 2,TYPE,Goal#,Period,TIME,TEAM,GOALscorer,ASSIST 1,ASSIST 2,TYPE,Goal#,Period,TIME,TEAM,GOALscorer,ASSIST 1,ASSIST 2,TYPE,Goal#,Period,TIME,TEAM,GOALscorer,ASSIST 1,ASSIST 2,TYPE,Goal#,Period,TIME,TEAM,GOALscorer,ASSIST 1,ASSIST 2,TYPE,Goal#,Period,TIME,TEAM,GOALscorer,ASSIST 1,ASSIST 2,TYPE,Goal#,Period,TIME,TEAM,GOALscorer,ASSIST 1,ASSIST 2,TYPE,Goal#,Period,TIME,TEAM,GOALscorer,ASSIST 1,ASSIST 2,TYPE,Goal#,Period,TIME,TEAM,GOALscorer,ASSIST 1,ASSIST 2,TYPE,Goal#,Period,TIME,TEAM,GOALscorer,ASSIST 1,ASSIST 2,TYPE,Goal#,Period,TIME,TEAM,GOALscorer,ASSIST 1,ASSIST 2,TYPE,Goal#,Period,TIME,TEAM,GOALscorer,ASSIST 1,ASSIST 2,TYPE,Goal#,Period,TIME,TEAM,GOALscorer,ASSIST 1,ASSIST 2,TYPE,Pen#,PERIOD,TIME,TEAM,Penalty,Type,Pen#,PERIOD,TIME,TEAM,Penalty,Type,Pen#,PERIOD,TIME,TEAM,Penalty,Type,Pen#,PERIOD,TIME,TEAM,Penalty,Type,Pen#,PERIOD,TIME,TEAM,Penalty,Type,Pen#,PERIOD,TIME,TEAM,Penalty,Type,Pen#,PERIOD,TIME,TEAM,Penalty,Type,Pen#,PERIOD,TIME,TEAM,Penalty,Type,Pen#,PERIOD,TIME,TEAM,Penalty,Type,Pen#,PERIOD,TIME,TEAM,Penalty,Type,Pen#,PERIOD,TIME,TEAM,Penalty,Type,Pen#,PERIOD,TIME,TEAM,Penalty,Type,Pen#,PERIOD,TIME,TEAM,Penalty,Type,Pen#,PERIOD,TIME,TEAM,Penalty,Type,Pen#,PERIOD,TIME,TEAM,Penalty,Type`
