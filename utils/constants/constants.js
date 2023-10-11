// when adding a new league they have to be added to
// 1. LEAGUE_SCHEMA_SWITCH

export const LEAGUE_TABLE_CATEGORIES = ["GP", "W", "L", "T", "OTL", "Pts"];

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

export const DEFAULT_LEAGUE = "w";

export const MOST_RECENT_SEASON = "8";

export const LEAGUE_SCHEMA_SWITCH = function (leagueName, wLeagueSchema) {
  switch (leagueName) {
    case "w":
      return wLeagueSchema;
    default:
      return wLeagueSchema;
  }
};

export const CLEAR_LEAGUE_TABLE_SWITCH = function (leagueName, wLeagueSchema) {
  switch (leagueName) {
    case "w":
      return wLeagueSchema;
    default:
      return;
  }
};
