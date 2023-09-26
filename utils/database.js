import mongoose from "mongoose";
import { URI } from "./constants";

const connectedMessage = `Connected to wn95hl database`;

export const connectToDb = async () => {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(connectedMessage);
  } catch (error) {
    console.log(error);
    throw new Error(`An error has occured with the database..`);
  }
};
