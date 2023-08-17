import express from "express";
import { validateBody } from "../../decorators/index.js";
import userSchema from "../../schema/user-schema.js";
import authController from "../../controllers/auth-controller.js";
import { authenticate } from "../../middlewars/authenticate.js";

const authRouter = express.Router();

export default authRouter;

authRouter.post(
  "/signup",
  validateBody(userSchema.userSignUpSchema),
  authController.signup
);

authRouter.post(
  "/signin",
  validateBody(userSchema.userSigninSchema),
  authController.signin
);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/signout", authenticate, authController.signout);
