import User from "@/schemas/user";

const createNewUser = async (userName) => {
  const newUser = await new User({ name: userName });
  return await newUser.save();
};

export default createNewUser;
