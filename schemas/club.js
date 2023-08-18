import { Schema, model, models } from "mongoose";

const ClubSchema = new Schema(
  {
    name: String,
    nickname: String,
    teamLogo: String,
    teamAcronym: String,
    teamBanner: String,
    coachId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Club = models.Club || model("Club", ClubSchema);

export default Club;
