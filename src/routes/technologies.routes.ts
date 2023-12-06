import { Router } from "express";
import { TechnologiesController } from "../Controllers/TechnologiesController";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated";


const technologiesRoutes = Router(); 

const technologiesController = new TechnologiesController();

technologiesRoutes.put("/", ensureAuthenticated, technologiesController.update)
technologiesRoutes.get("/:user_id", technologiesController.show)


export {technologiesRoutes}