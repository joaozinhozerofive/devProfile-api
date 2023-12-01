import { Router } from "express";
import { testandoRoutes } from "./testando.routes";


const routes = Router();


routes.use("/testando", testandoRoutes)




export  {routes}