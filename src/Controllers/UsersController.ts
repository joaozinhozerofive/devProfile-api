import {Response, Request} from "express";
import { AppError } from "../utils/AppError";
import {prisma} from '../prisma/index'
import { compare, hash } from 'bcryptjs'


export interface UserProps{
    name :  string
    email :  string 
    old_password : string
    password: string
    ocupation : string
    about : string
}

export class UsersController{
    
    
    async create(request :Request, response :Response){
        const {name, email, password, ocupation } : UserProps  = request.body;
        const missingPasswordLength : number = Math.abs(password.length - 6)
        const hashedPassword = await hash(password, 8)



        const checkUserExists = await prisma.user.findFirst({
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

             await prisma.user.create({
                data:{
                  name: name,
                  email: email,
                  password: hashedPassword, 
                  ocupation
                  
                }
              })

              return response.json({message : "Usuário criado com sucesso"})

        }catch{
            throw new AppError("Falha ao criar usuário")
            
        }
    }


    async update(request :Request, response :Response){
        const {name, email, password, old_password, ocupation, about} : UserProps = request.body; 
        const  user_id : number = request.user.id 
        


    
        const user = await prisma.user.findFirst({
          where: {
            id: user_id
          }
        });

       
        
        const checkEmailExists = await prisma.user.findFirst({
            where: {
                email: email
            }
        })



        if(checkEmailExists && checkEmailExists.id !== user.id  ){
            throw new AppError("Este e-mail já está em uso")
        }

        if(password && !old_password){
            throw new AppError("Você precisa informar a senha antiga para definir a nova senha.")
        }

        if(password && old_password){
            const checkOldPassword = await compare(old_password, user.password)

            if(!checkOldPassword){
                throw new AppError("A senha antiga não confere")
            }

            user.password = password ? await hash(password,8) : user.password

        }

        user.name = name ?? user.name;
        user.email =  email ?? user.email,
        user.about = about ?? user.about,
        user.ocupation = ocupation ?? user.ocupation 
        user.Updated_at = new Date()


         



        try{
            await prisma.user.update({
                where : {
                    id : user_id
                }, 
                data:{
                       ...user
                }
            })

            return response.json({user})


        }catch{
            throw new AppError("Não foi possível atualizar seus dados.")
        }
    }


    async index(request :Request, response :Response){

        try {
        const {name} = request.query as {name : string}


        const users = await prisma.user.findMany({
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
            users
        })

        }catch{
            throw new AppError("Não foi possível obter informações dos usuário")
        }
        

        
    }

    async show(request: Request, response: Response) {

        try{
        const { user_id }  = request.params  as {user_id : string}

    
        const user = await prisma.user.findFirst({
          where: {
            id: Number(user_id)
          }
        });


        if(!user){
            throw new AppError("Usário não encontrado")
        }
    
        return response.json({
            user
        });

        }catch{
            throw new AppError("Não foi possível obter informações do usuário")
        }
        
      }



    async delete(request :Request, response :Response){

        const  user_id : number = request.user.id 


        const user = await prisma.user.findFirst({
            where: {
              id: user_id
            }
          });


          if(!user){
            throw new AppError("Usuário não encontrado")
          }
  
  
          

        try{
              await prisma.user.delete({
               where: {
                 id: user_id
               }
        
            });

          }catch{
            throw new AppError("Não foi posível excluir portfólio")
          }

    
        return response.json({message : "Usuário deletado com sucesso."});
      }

    }


