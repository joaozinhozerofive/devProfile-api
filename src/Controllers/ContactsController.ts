import { Response, Request } from "express";
import { AppError } from "../utils/AppError";
import {prisma} from '../prisma/index'

interface ContactsProps{
    whatsapp : string,
    linkedin : string, 
    github : string, 
    email  : string
}

export class ContactsController{

   

    async update(request: Request, response:Response){
        const {email, github, linkedin, whatsapp} : ContactsProps = request.body; 

        const user_id : number = request.user.id;

        if(!email || !github  || !linkedin || !whatsapp){
            throw new AppError("Por favor, informe todas as opções de contato")
        }

        try{
            const contactsExists = await prisma.contact.findFirst({
                where : {
                    user_id : user_id
                }
            })

            if(contactsExists){

                await prisma.contact.update({
                    where : {
                        id : contactsExists.id
                    }, 
                    data : {
                        email : email ?? contactsExists.email,
                        github : github ?? contactsExists.github,
                        linkedin : linkedin ?? contactsExists.linkedin,
                        whatsapp :  whatsapp ?? contactsExists.whatsapp,
                        Updated_at : new Date()
                    }
                })

                
            } else{

                await prisma.contact.create({
                    data : {
                        user_id,
                        email, 
                        github, 
                        linkedin, 
                        whatsapp, 
                    }
                })

            }


            return response.json({message : "Contatos atualizados com sucesso. "})

            
        }catch{
            throw new AppError("Não foi possível editar informações de contato")
        }
       
    }


     async show(request: Request, response:Response){

        try{
            const {user_id} = request.params as {user_id : string}

            const user = await prisma.user.findFirst({
                where : {
                    id : Number(user_id)
                }
            })


            if(!user){
                throw new AppError("Usuário não encontrado")
            }



            const userContacts = await prisma.contact.findFirst({
                where : {
                    user_id : Number(user_id)
                }, 
            })

    
            return response.json({
                userContacts
            })


        }catch{
            throw new AppError("Não foi possível obter informações de contato.")
        }
       

    }


    
}