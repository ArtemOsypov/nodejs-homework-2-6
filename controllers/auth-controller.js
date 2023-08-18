import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { HttpError } from "../helpers/index.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";

const avatarPath = path.resolve("public", "avatars");

const { JWT_SECRET } = process.env;

const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, "email in use");
    }
    const avatarUrl = gravatar.url(email);
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ ...req.body, password: hashPassword });
    res.status(201).json({
      user: {
        avatarUrl,
        email: newUser.email,
        name: newUser.name,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, "email or pasword invalid");
    }

    const passwordCompaire = await bcrypt.compare(password, user.password);
    if (!passwordCompaire) {
      throw HttpError(401, "email or pasword invalid");
    }

    const payload = {
      id: user._id,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({
      token,
    });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: oldPath, originalname } = req.file;

  await Jimp.read(oldPath)
    .then((avatar) => {
      return avatar.resize(250, 250);
    })
    .catch((err) => {
      throw err;
    });

  const filename = `${_id}_${originalname}`;
  const resultUpload = path.resolve(avatarPath, filename);
  await fs.rename(oldPath, resultUpload);
  const avatarUrl = path.resolve("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarUrl });
  res.status(200).json({ avatarUrl });
};

const getCurrent = (req, res) => {
  const { name, email } = req.user;
  res.json({ name, email });
};

const signout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.json({
    massage: "signout sucsess!",
  });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout),
  updateAvatar: ctrlWrapper(updateAvatar),
};
