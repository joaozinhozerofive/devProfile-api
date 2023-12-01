import { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import {prisma} from '../prisma/index'
import { User } from "@prisma/client";
import { hash } from 'bcryptjs'


interface UserCreateProps{
    name :  string
    email :  string 
    password: string
    ocupation : string
    about? :string
}

interface UserIndexProps{
    name? : string
}


interface UserShowProps{
    user_id : number 
}
export class UsersController{
    
    
    async create(request :Request, response :Response){
        const {name, email, password, ocupation } : UserCreateProps  = request.body;
        const missingPasswordLength : number = Math.abs(password.length - 6)
        const hashedPassword = await hash(password, 8)



        const checkUserExists : User | null = await prisma.user.findFirst({
            where: { 
                email : email
            }, 
        })




        if( !name  || !email || !password || !ocupation ){
            throw new AppError("Por favor, insira todos os dados.")
        }

        if(checkUserExists){
            throw new AppError("Este email já está cadastrado")
        }

        if(password.length < 6){
            throw new AppError(`Ops! Faltou ${missingPasswordLength} caracteres na sua senha`)
        }

        try{

            const user = await prisma.user.create({
                data:{
                  name: name,
                  email: email,
                  password: hashedPassword, 
                  ocupation
                  
                }
              })

              return response.json(

                {message : "Usuário criado com sucesso"}
            )

        }catch{
            throw new AppError("Falha ao criar usuário")
            
        }
    }



    async index(request :Request, response :Response){
        const {name} = request.query as UserIndexProps


            const user = await prisma.user.findMany({
                where: {
                    name:{
                        contains : name?.toLowerCase()
                    }
                }, 
                select:{
                    name : true, 
                    ocupation : true, 
                    about : true
                }
            })


        return response.json({
            user
        })

        
    }

    async show(request: Request, response: Response) {
        const { user_id }  = request.params  as Record<string, string>

    
        const user = await prisma.user.findFirst({
          where: {
            id: Number(user_id)
          }
        });


        if(!user){
            throw new AppError("Uusário não encontrado")
        }
    
        return response.json({
            user
        });
      }


    async delete(request :Request, response :Response){

        const { user_id }  = request.params  as Record<string, string>

        const tipoUser_id = typeof user_id

        const user = await prisma.user.findFirst({
            where: {
              id: Number(user_id)
            }
          });
  
  
          if(!user){
              throw new AppError("Uusário não encontrado")
          }

          try{
              await prisma.user.delete({
               where: {
                 id: Number(user_id)
               }
        
            });

          }catch{
            throw new AppError("Não foi posível excluir portfólio")
          }

    
        return response.json({
            message: "Portfólio excluído com sucesso"
        });
      }

    }


