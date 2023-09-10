import mongoose from "mongoose";

const connectedMessage = `Connected to wn95hl database`;

export const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.HOME_URI, {
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
