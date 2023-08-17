import { Schema, model } from "mongoose";

import { validateAtUpdate, hamdleSaveError } from "./hooks.js";

import { emailRegexp } from "../constants/user-constants.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: emailRegexp,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: true,
    },
    token: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.pre("findOneAndUpdate", validateAtUpdate);

userSchema.post("save", hamdleSaveError);
userSchema.post("findOneAndUpdate", hamdleSaveError);

const User = model("user", userSchema);

export default User;
