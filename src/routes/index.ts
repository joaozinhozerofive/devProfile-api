import { Router } from "express";
import { usersRoutes } from "./users.routes";
import { sessionsRoutes } from "./sessions.routes";
import { contactsRoutes } from "./contacts.routes";
import { technologiesRoutes } from "./technologies.routes";
import { projectsRoutes } from "./projects.routes";
import { experienceRoutes } from "./experience.routes";


const routes = Router();


routes.use("/users", usersRoutes)
routes.use("/sessions", sessionsRoutes)
routes.use("/contacts", contactsRoutes)
routes.use("/technologies", technologiesRoutes)
routes.use("/projects", projectsRoutes)
routes.use("/experience", experienceRoutes)



export {routes}