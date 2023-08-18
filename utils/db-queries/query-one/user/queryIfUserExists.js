// return true of false if a user is in the users db
import User from "@/schemas/user";

const queryIfUserExists = async (userName) => {
  const user = await User.exists({ name: userName });
  if (user !== null) {
    return true;
  }
  return false;
};

export default queryIfUserExists;
