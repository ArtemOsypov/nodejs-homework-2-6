import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
const { JWT_SECRET } = process.env;

export const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  //   console.log(bearer);
  //   console.log(token);
  if (bearer !== "Bearer") {
    throw HttpError(401);
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = User.findById(id);
    // console.log(user);
    if (!user) {
      throw HttpError(401);
    }
    req.user = user;
    console.log(req.user);
    next();
  } catch (error) {
    next(error);
  }
};

export default ctrlWrapper(authenticate);
