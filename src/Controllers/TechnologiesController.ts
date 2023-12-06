import { Response, Request } from "express";
import { AppError } from "../utils/AppError";
import {prisma} from '../prisma/index'

interface TechnologiesProps{
    technologies : string[]
}


 export class TechnologiesController{
    async update(request : Request, response : Response){

    
        const { technologies } : TechnologiesProps = request.body;
        const  user_id : number = request.user.id 



        const technologiesExists = await prisma.technologie.findFirst({
            where : {
                user_id 
            }
        })

        if(!technologies){
            throw new AppError("Por favor, insira ao menos 1 tecnologia")
        }


        if(technologiesExists){
            await prisma.technologie.deleteMany({
                where : {
                    user_id
                }
            })
        }
    try{

        technologies.map(async (technologie) => 
            await prisma.technologie.createMany({
                data: {
                    name : technologie, 
                    user_id, 
                    Updated_at : new Date(),
                }
            })
            )

            return response.json({message : "Tecnologias atualizadas com sucesso."})

    }catch{
        throw new AppError("Não foi possível atualizar as tecnologias")

    }
    }


    async show(request : Request, response : Response){

   try{

        const {user_id} = request.params as {user_id : string}

        const technologies  = await prisma.technologie.findMany({
            where : {
                user_id : Number(user_id)
            }, 
            select : {
                id : true,
                name : true
            }
        })


        return response.json({
            technologies
        })

        }catch{
            throw new AppError("Não foi possível encontrar tecnologias")
        }


    }   
}
