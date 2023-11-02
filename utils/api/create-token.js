import { sign } from "jsonwebtoken";

const createToken = (_id) => {
  return sign({ _id }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
};

export default createToken;
