import express from "express";
import { validateBody } from "../../decorators/index.js";
import userSchema from "../../schema/user-schema.js";
import authController from "../../controllers/auth-controller.js";
import { authenticate } from "../../middlewars/authenticate.js";
import { upload } from "../../middlewars/upload.js";

const authRouter = express.Router();

export default authRouter;

authRouter.post(
  "/signup",
  validateBody(userSchema.userSignUpSchema),
  authController.signup
);

authRouter.get("/verify/:verificationCode", authController.verify);

authRouter.post(
  "/verify",
  validateBody(userSchema.userEmailSchema),
  authController.resendVerifyEmail
);

authRouter.post(
  "/signin",
  validateBody(userSchema.userSigninSchema),
  authController.signin
);

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  authController.updateAvatar
);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/signout", authenticate, authController.signout);
