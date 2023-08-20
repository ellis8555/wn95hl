// return either all clubs or a single club
import Club from "@/schemas/club";

async function queryOneClub(clubName) {
  return await Club.findOne({ name: clubName });
}

export default queryOneClub;
