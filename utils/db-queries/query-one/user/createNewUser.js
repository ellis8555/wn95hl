import User from "@/schemas/user";

const createNewUser = async (userName, isAdmin) => {
  const newUser = await new User({ name: userName, isAdmin: isAdmin });
  return await newUser.save();
};

export default createNewUser;
