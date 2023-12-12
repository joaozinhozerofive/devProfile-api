import { Response, Request } from "express";
import { AppError } from "../utils/AppError";
import {prisma} from '../prisma/index'
import { compare } from 'bcryptjs'
import {sign, verify} from 'jsonwebtoken'
import { authSecrets } from "../configs/auth";
import { UserProps } from "./UsersController";


interface PayloadProps {
    sub : string
}





export class SessionsController{
    async create(request : Request, response : Response){
        const {email, password} : UserProps = request.body; 
        
        const user = await prisma.user.findFirst({
            where : {
                email : email
            }, 
        });



        if(!email || !password){
            throw new AppError("Preencha todos os campos, por favor.")
        }


        if(!user){
            throw new AppError("Usuário e/ou senha incorretos. ")
        }

        const passwordMatched = await compare(password, user.password)


        if(!passwordMatched){
            throw new AppError("Usuário e/ou senha incorretos. ")
        }

        const {secret, expiresIn} = authSecrets.jwt; 

        const token = sign({}, secret, {
            subject : String(user.id), 
            expiresIn
        } ); 
            
        return response.json({user, token})
    }
}