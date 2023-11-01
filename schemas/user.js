import { Schema, model, models } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "A name is required.."],
      unique: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
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

// static auths
// 5. change password
// 6. login

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

// password change for user
UserSchema.statics.changePassword = async function (name, password) {
  // validate
  if (!name || !password) {
    throw new Error("Both fields need to be filled");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("password is not strong enough");
  }

  const user = await this.findOne({ name });

  const hash = await bcrypt.hash(password, 10);

  user.password = hash;

  await user.save();

  return user;
};

UserSchema.statics.login = async function (name, password) {
  // validate
  if (!name || !password) {
    throw new Error("Both fields need to be filled");
  }

  const user = await this.findOne({ name });

  if (!user) {
    throw new Error("User is not registered");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Credentials not authorized");
  }

  return user;
};

const User = models.user || model("user", UserSchema);

export default User;
