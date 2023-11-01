import { sign } from "jsonwebtoken";

const createToken = (_id) => {
  return sign({ _id }, process.env.NEXT_PUBLIC_REACT_APP_SECRET_KEY, {
    expiresIn: "7d",
  });
};

export default createToken;