import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "A name is required.."],
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// statics
// 1. queryIfUserExists
// 2. createNewUser
// 3. queryOneUser
// 4. queryAllUsers

UserSchema.statics.queryIfUserExists = async function (name) {
  const user = await this.exists({ name });
  if (user !== null) {
    return true;
  }
  return false;
};

UserSchema.statics.createNewUser = async function (name) {
  const newUser = new User({ name });
  return await newUser.save();
};

UserSchema.statics.queryOneUser = async function (name) {
  return await this.findOne({ name });
};

UserSchema.statics.queryAllUsers = async function () {
  return await this.find({});
};

const User = models.User || model("user", UserSchema);

export default User;
