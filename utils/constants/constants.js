//  netlify domain https://tiny-lokum-ab0acc.netlify.app
// http://localhost:3000
export const API_DOMAIN = "https://tiny-lokum-ab0acc.netlify.app";

export const LEAGUE_TABLE_CATEGORIES = ["GP", "W", "L", "T", "OTL", "Pts"];

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
