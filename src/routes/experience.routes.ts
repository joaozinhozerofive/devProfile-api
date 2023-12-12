import { Router } from "express";
import { ExperienceController } from "../Controllers/ExperienceController";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated";


const experienceRoutes = Router();

const experienceController = new ExperienceController();


experienceRoutes.post("/",ensureAuthenticated, experienceController.create)
experienceRoutes.put("/:experience_id", ensureAuthenticated,  experienceController.update)
experienceRoutes.get("/:user_id", experienceController.index)
experienceRoutes.get("/:project_id/detail", experienceController.show)
experienceRoutes.delete("/:experience_id", ensureAuthenticated, experienceController.delete)




export {experienceRoutes}