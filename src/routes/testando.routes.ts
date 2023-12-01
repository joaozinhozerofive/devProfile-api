import { Router } from "express";
import { TestandoController } from "../Controllers/TestandoController";

const testandoRoutes = Router()

const testandoController = new TestandoController()



testandoRoutes.post("/", testandoController.index)

export {testandoRoutes}
