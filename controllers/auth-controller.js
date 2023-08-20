import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { HttpError, sendEmail, createVerifyEmail } from "../helpers/index.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";
import { nanoid } from "nanoid";

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
    const verificationCode = nanoid();
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      verificationCode,
    });

    const verifyEmail = createVerifyEmail({ email, verificationCode });
    await sendEmail(verifyEmail);

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

const verify = async (req, res) => {
  const { verificationCode } = req.params;
  const user = await User.findOne({ verificationCode });
  console.log(user._id);
  if (!user) {
    throw HttpError(404, "Email not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationCode: "",
  });
  console.log(user._id);
  res.json({
    message: "Verify success",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = User.findOne({ email });
  if (!user) {
    throw HttpError(404, "Email not found");
  }
  if (user.verify) {
    throw HttpError(400, "email already verified");
  }
  const verifyEmail = createVerifyEmail({
    email,
    verificationCode: user.verificationCode,
  });
  await sendEmail(verifyEmail);
  res.json({
    message: "Resend email success",
  });
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, "email or pasword invalid");
    }
    if (!user.verify) {
      throw HttpError(401, "email not verify");
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
  verify: ctrlWrapper(verify),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout),
  updateAvatar: ctrlWrapper(updateAvatar),
};
