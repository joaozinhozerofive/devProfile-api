import { verify } from "jsonwebtoken";
import { authSecrets } from "../configs/auth";
import { AppError } from "../utils/AppError";
import { Request, Response, NextFunction } from "express";


interface PayloadProps{
    sub : string
}


export function ensureAuthenticated(request : Request, response : Response, next : NextFunction){
    const authHeader = request.headers.authorization
    
    
  if(!authHeader){
        throw new AppError("JWT token não informado", 401); 
    }

    const [ , token] = authHeader.split(" ")

    try{
    const {sub : user_id} = verify(token, authSecrets.jwt.secret) as PayloadProps
    
    request.user = {
        id : Number(user_id),
    }

    return next();


    }catch{
        throw new AppError("Token inválido", 401)
    }
    
}
