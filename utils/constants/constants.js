// export const DB_CONNECT = process.env.HOME_URI;
export const DB_CONNECT = process.env.MONGO_URI;
// export const DB_CONNECT = process.env.MONGO_DEV_URI;

// export const DOMAIN = "http://localhost:3000";
export const DOMAIN = "https://nhl95.vercel.app";
// export const DOMAIN = "https://tiny-lokum-ab0acc.netlify.app";

// export const ORIGIN = process.env.ALLOW_HOME_ORIGIN;
export const ORIGIN = process.env.ALLOW_VERCEL_ORIGIN;
// export const ORIGIN = process.env.ALLOW_NETLIFY_ORIGIN

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

export const SORT_STANDINGS = function (a, b) {
  // First, sort by 'Pts' property in descending order
  if (b.Pts - a.Pts !== 0) {
    return b.Pts - a.Pts;
  } else if (b.GP - a.GP !== 0) {
    return b.GP - a.GP;
  } else {
    // If 'Pts' and 'GP' are equal, check 'GP' values for zero
    if (a.GP === 0 && b.GP === 0) {
      // If both 'GP' values are 0, sort by 'teamName' in ascending order
      return a.teamName.localeCompare(b.teamName);
    } else if (a.GP === 0) {
      // If 'GP' of 'a' is 0, it comes first
      return -1;
    } else if (b.GP === 0) {
      // If 'GP' of 'b' is 0, it comes first
      return 1;
    } else {
      // If 'GP' values are non-zero and equal, sort by 'teamName'
      return a.teamName.localeCompare(b.teamName);
    }
  }
};
