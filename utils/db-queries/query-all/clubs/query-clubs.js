// return all club objects
import Club from "@/schemas/club";

async function queryClubs() {
  return await Club.find({});
}

export default queryClubs;
