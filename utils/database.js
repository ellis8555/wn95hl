import mongoose from "mongoose";
import { DB_CONNECT } from "./constants/connections";

const connectedMessage = "Connected to wn95hl database";
const disconnectedMessage = "Database connection closed.";

export const connectToDb = async () => {
  try {
    await mongoose.connect(DB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
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
    console.log(disconnectedMessage);
  } catch (error) {
    console.log(error);
  }
};
