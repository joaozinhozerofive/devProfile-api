import { Router } from "express";
import { ProjectsController } from "../Controllers/ProjectsController";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated";
import  {uploadConfig}  from "../configs/multer";
import multer from "multer";

const projectsRoutes = Router();

const projectsController = new ProjectsController(); 

const upload = multer(uploadConfig)



projectsRoutes.post("/", ensureAuthenticated, upload.single("img"), projectsController.create)
projectsRoutes.put("/:project_id", ensureAuthenticated, upload.single("img"), projectsController.update)
projectsRoutes.delete("/:project_id", ensureAuthenticated, projectsController.delete)
projectsRoutes.get("/:user_id", projectsController.index)
projectsRoutes.get("/:project_id/detail", projectsController.show)

export { projectsRoutes } ; 