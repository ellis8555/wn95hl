import mongoose from "mongoose";
import { DB_CONNECT } from "./constants/connections";

const connectedMessage = `Connected to wn95hl database`;

export const connectToDb = async () => {
  try {
    await mongoose.connect(DB_CONNECT, {
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

export const closeDbConnection = async () => {
  try {
    await mongoose.disconnect();
    console.log("Database connection closed.");
  } catch (error) {
    console.log(error);
  }
};
