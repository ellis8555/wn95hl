// return a users object
import User from "@/schemas/user";

async function queryOneUser(userName) {
  return await User.findOne({ name: userName });
}

export default queryOneUser;
