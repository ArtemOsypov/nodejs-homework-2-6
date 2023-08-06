import express from "express";

import controller from "../../controllers/controllers.js";

const contactsRouter = express.Router();

contactsRouter.get("/", controller.getAll);

contactsRouter.get("/:id", controller.getById);

contactsRouter.post("/", controller.add);

contactsRouter.delete("/:id", controller.delById);

contactsRouter.put("/:id", controller.updateById);

export default contactsRouter;
