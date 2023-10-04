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

// statics
// 1. queryIfClubExists
// 2. queryOneClub
// 3. queryClubDetail
// 4. queryAllClubs

ClubSchema.statics.queryIfClubExists = async function (clubName) {
  return await this.exists({ name: clubName });
};

ClubSchema.statics.queryOneClub = async function (clubName) {
  return await this.findOne({ name: clubName });
};

ClubSchema.statics.queryClubDetail = async function (
  filterByProp,
  value,
  returnProp
) {
  // returns a requested club detail filtered by field that is input.
  // example qeury args ('teamAcronym', 'AHC', 'name') returns name of club with acronym matching 'AHC'
  // example would return 'Alberta'
  const findClub = await this.findOne({ [filterByProp]: value });
  return findClub[returnProp];
};

ClubSchema.statics.queryAllClubs = async function () {
  return await this.find({});
};

const Club = models.Club || model("club", ClubSchema);

export default Club;
