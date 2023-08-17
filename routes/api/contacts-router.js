import express from "express";

import controller from "../../controllers/controllers.js";

import { isValidId } from "../../middlewars/index.js";

import { authenticate } from "../../middlewars/authenticate.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", controller.getAll);

contactsRouter.get("/:id", isValidId, controller.getById);

contactsRouter.post("/", controller.add);

contactsRouter.delete("/:id", isValidId, controller.delById);

contactsRouter.put("/:id", isValidId, controller.updateById);

contactsRouter.patch("/:id/favorite", isValidId, controller.updateFavorite);

export default contactsRouter;
