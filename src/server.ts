import express, {Request, Response, NextFunction, json, response} from "express";
import "express-async-errors"
import cors from 'cors'
import path from "path"

import { routes } from "./routes";
import { AppError } from "./utils/AppError";


const app =  express()
app.use(express.json())
app.use(cors())
app.use(routes)
app.use("/files", express.static(path.resolve(__dirname, '..', "tmp")))



app.use((error : Error, request : Request, response : Response, next : NextFunction) => {
    if(error instanceof AppError){
        return response.status(error.statusCode).json({
            status : "error" , 
            message: error.message
        })
    }
    console.log(error)
    
    return response.status(500).json({
        status : "error",
        message : "internal server error"
    })
    
})


const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log("Server is running on PORT:" + PORT )
})