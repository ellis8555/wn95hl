// return all club objects
import User from "@/schemas/user";

async function queryAllUsers() {
  return await User.find({});
}

export default queryAllUsers;
