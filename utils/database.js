import mongoose from "mongoose";
import { DB_CONNECT } from "./constants/connections";

const connectedMessage = "Connected to wn95hl database";
const disconnectedMessage = "Database connection closed.";
const notYetLocated = "yet to be located";

export const connectToDb = async (callingLocation = notYetLocated) => {
  try {
    await mongoose.connect(DB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`${connectedMessage} (${callingLocation})`);
  } catch (error) {
    console.log(error);
    throw new Error(`An error has occured with the database..`);
  }
};

export const closeDbConnection = async (callingLocation = notYetLocated) => {
  try {
    await mongoose.disconnect();
    console.log(`${disconnectedMessage} (${callingLocation})`);
  } catch (error) {
    console.log(error);
  }
};
