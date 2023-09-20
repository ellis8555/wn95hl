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

// signup method on user objects
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

const User = models.User || model("User", UserSchema);

export default User;
