import { Response, Request } from "express";
import { AppError } from "../utils/AppError";
import {prisma} from '../prisma/index'


interface ExperienceProps { 
    companyName : string
    city  : string 
    FU : string
    startDate  : string 
    endDate : string
    description : string
}

export class ExperienceController{
    async create(request: Request, response:Response){

        const {companyName, city, FU, startDate, endDate, description} : ExperienceProps = request.body;
        const user_id : number = request.user.id

        if(!companyName || !city || !FU || !startDate || !endDate || !description){
            throw new AppError("Por favor preencha todos os campos.")
        }

      try{

        const experience = await prisma.work.create({
            data : {
                user_id,
                companyName, 
                city, 
                FU, 
                startDate, 
                endDate, 
                description 
            }
        })


        return response.json(experience)

      }catch{
        throw new AppError("Não foi possível criar experiência")
      } 

    }




    async update(request: Request, response:Response){
        const {companyName, city, FU, startDate, endDate, description} : ExperienceProps = request.body;
        const {experience_id} = request.params as {experience_id : string}
        const user_id : number = request.user.id

        const experience = await prisma.work.findFirst({
            where : {
                id : Number(experience_id)
            }
        })


        if(!experience){
            throw new AppError("Experiência não encontrada")
        }

        const userIdMatched = experience.user_id === user_id

        if(!userIdMatched){
            throw new AppError('Você não pode atualizar informações de outro usuário')
        }

        experience.companyName = companyName ?? experience.companyName;
        experience.city = city ?? experience.city;
        experience.FU = FU ??  experience.FU;
        experience.startDate =  startDate ?? experience.startDate;
        experience.endDate =  endDate ?? experience.endDate;
        experience.description = description ?? experience.description;


        try{

            await prisma.work.update({
                where : {
                    id :  experience.id 
                }, 
                data : {
                    ...experience
                }
            })


            return response.json(experience)
        }catch{
            throw new AppError("Não foi possível atualizar os dados desta experiência.")
        }

        
    }


    async delete(request: Request, response:Response){
        const {experience_id} = request.params as {experience_id : string}
        const user_id = request.user.id

        const experiences = await prisma.work.findFirst({
            where : {
                id : Number(experience_id)
            }
        })

        if(!experiences){
            throw new AppError("Experiência não encontrada.")
        }

        const userIdMatched  = user_id == experiences.user_id

        if(!userIdMatched){
            throw new AppError("Você não pode excluir informações de outro usuário")
        }

        try{

            await prisma.work.delete({
                where : {
                    id : experiences.id
                }
            })

        return response.json('Experiência excluída com sucesso!')


        }catch{
            throw new AppError("Não foi possível excluir esta experiencia")
        }



    }


    async index (request: Request, response:Response){
        try{
              const {user_id} = request.params as {user_id : string }; 

        const experiences = await prisma.work.findMany({
            where : {
                user_id : Number(user_id)
            }
        })


        if(!experiences){
            throw new AppError("Não foi possível encontrar experiências deste usuário ")
        }else{
            return response.json(experiences)
        }

        
        }catch{
            throw new AppError("Não foi possível encontrar informações de experiência")
        }
      


        

    }


    async show(request: Request, response:Response){
      try{

        const {project_id} = request.params

        const project = await prisma.work.findFirst({
            where : {
                id : Number(project_id)
            }
        })

        return response.json(project)

      }catch{
        throw new AppError("Não foi possível visualizar esta experiência")
      }  
    }

    
}