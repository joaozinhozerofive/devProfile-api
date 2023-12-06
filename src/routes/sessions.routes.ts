import { Router } from "express";
import { SessionsController } from "../Controllers/SessionsController";


const sessionsRoutes = Router()

const sessionsController = new SessionsController(); 


sessionsRoutes.post("/", sessionsController.create);

export {sessionsRoutes}





