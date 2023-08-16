import User from "../models/user.js";
import { HttpError } from "../helpers/index.js";

const signup = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, "email in use");
    }
    const newUser = await User.create(req.body);
    res.status(201).json({
      name: newUser.name,
      email: newUser.email,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  signup,
};
