import express, {Request, Response, NextFunction, json} from "express";
import { routes } from "./routes";


const app =  express()
app.use(json())
app.use(routes)

const PORT = 3030

app.listen(PORT, () => {
    console.log("Server is running on PORT:" + PORT)
})