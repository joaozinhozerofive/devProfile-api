import { Router } from "express";
import { UsersController } from "../Controllers/UsersController";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated";
import  {uploadConfig}  from "../configs/multer";
import multer from "multer";

const upload = multer(uploadConfig)


const usersRoutes = Router()

const usersController = new UsersController()



usersRoutes.post("/", usersController.create)
usersRoutes.put("/", upload.single("img"), ensureAuthenticated, usersController.update)
usersRoutes.get("/", usersController.index)
usersRoutes.get("/:user_id", usersController.show)
usersRoutes.delete("/", ensureAuthenticated, usersController.delete)

export {usersRoutes}
