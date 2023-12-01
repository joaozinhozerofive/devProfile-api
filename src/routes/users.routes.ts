import { Router } from "express";
import { UsersController } from "../Controllers/UsersController";

const usersRoutes = Router()

const usersController = new UsersController()



usersRoutes.post("/", usersController.create)
usersRoutes.get("/", usersController.index)
usersRoutes.get("/:user_id", usersController.show)
usersRoutes.delete("/:user_id", usersController.delete)

export {usersRoutes}
