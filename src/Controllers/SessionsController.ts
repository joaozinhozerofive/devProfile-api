import { Response, Request } from "express";
import { AppError } from "../utils/AppError";
import {prisma} from '../prisma/index'
import { User } from "@prisma/client";
import { compare } from 'bcryptjs'
import { UserProps } from "./UsersController";
import {sign, verify} from 'jsonwebtoken'
import { authSecrets } from "../configs/auth";


interface PayloadProps {
    sub : string
}


export class SessionsController{
    async create(request : Request, response : Response){
        const {email, password} : UserProps = request.body; 
        
        const user : User | null = await prisma.user.findFirst({
            where : {
                email : email
            }
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