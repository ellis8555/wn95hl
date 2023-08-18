// return true of false if a club is in the clubs db
import Club from "@/schemas/club";

async function queryIfClubExists(clubName) {
  return await Club.exists({ name: clubName });
}

export default queryIfClubExists;
