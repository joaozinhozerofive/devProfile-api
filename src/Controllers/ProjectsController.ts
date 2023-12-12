import { Response, Request } from "express";
import { AppError } from "../utils/AppError";
import {prisma} from '../prisma/index'
import { Multer } from "multer";


interface ProjectsProps{
    name : string
    description : string
    technologies? : string[]
    link : string
}


export class ProjectsController{
    async create(request: Request, response:Response){


        const {name, description, technologies, link} : ProjectsProps = request.body;
        const  img = request.file?.filename;
        const  user_id : number = request.user.id 


        if(!name || !description || !link){
            throw new AppError("Por favor, preencha todos os campos")
        }

        if(!technologies){
            throw new AppError("Por favor, insira ao menos uma tecnologia.")
        }


  try{
    
        const project  = await prisma.project.create({
            data: {
                user_id, 
                name, 
                link, 
                description,
                img: img ?? ""
            }

        })


          technologies.map(async (technologies) => {
           return await prisma.projectTechnologie.create({
                data: {
                    project_id : project.id, 
                    name,
                    Updated_at : new Date()
                }
            })
        })

        return response.json({message : "Projeto criado com sucesso", project, technologies})


    }catch{

            throw new AppError("Não foi possível criar este projeto");

        }
    }



    async update(request: Request, response:Response){

        const {name, description, technologies, link} : ProjectsProps = request.body;
        const {project_id} = request.params as {project_id : string}
        let  img = request.file?.filename;
        const  user_id : number = request.user.id 

        const project = await prisma.project.findFirst({
            where : {
                id : Number(project_id)
            }
        })

        const userIdMatched = project.user_id === user_id

        const technologiesExists  = await prisma.projectTechnologie.findFirst({
            where : {
                project_id : project.id
            }
        })

        if(!userIdMatched){
            throw new AppError("Você não pode atualizar informações de outros usuários")
        }

        if(!project){
            throw new AppError("Projeto não encontrado")
        }

        if(!technologies){
            throw new AppError("Por favor, insira pelo menos uma tecnologia")
        }

        
        if(technologiesExists){
            await prisma.projectTechnologie.deleteMany({
                where : {
                    project_id : project.id
                }
            })
        }


    try{    

       const newTechs =  await Promise.all (

        technologies.map( async technologie =>
                await prisma.projectTechnologie.create({
                        data: {
                            name : technologie, 
                            project_id : project.id, 
                            Updated_at : new Date(),
                        }
                    })

            )   
)

        project.name = name ?? project.name;
        project.description = description ?? project.description;
        project.link = link ?? project.link;
        project.img = img ?? project.img;
        project.Updated_at = new Date()


        await prisma.project.update({
            where : {
                id : project.id
            }, 
            data : {
                ...project
            }
        })

        return response.json(newTechs)

    }catch{
        throw new AppError("Não foi possível atualizar o projeto.")
    }
    }




    async index(request: Request, response:Response) {

    try{

        
        const { user_id } = request.params as {user_id : string}

        const user = await prisma.user.findFirst({
            where : {
                id : Number(user_id)
            }
        })

        const projects = await prisma.project.findMany({
            where : {
                user_id: user.id
            },
            include : {
                technologies : true
            }
        })

        return response.json(projects)

    }catch{
        throw new AppError("Não foi possível encontrar informações de projetos")
    }

    }


    async show(request: Request, response:Response) {

    try{
    
        const {project_id} = request.params as {project_id : string}

        const project = await prisma.project.findFirst({
            where: {
                id : Number(project_id)
            }, 
            include : {
                technologies : true
            }
        })



        if(!project){
            throw new AppError("Projeto não encontrado")
        }

    
        return response.json(project)


     }catch{
        throw new AppError("Não foi possível visualizar este projeto")
     }   
        
    }


    async delete(request: Request, response:Response){

        const {project_id} = request.params as {project_id : string }
        const user_id : number = request.user.id

        const user = await prisma.user.findFirst({
            where : {
                id : user_id
            }
        })

        const project = await prisma.project.findFirst({
            where : {
                id : Number(project_id)
            }
        })

        if(!project){
            throw new AppError("Não foi possível encontrar este projeto")
        }


        try{
            const userIdMatched = user_id === project.user_id


            if(!userIdMatched){
                throw new AppError("Você não pode excluir informações de outro usuário.")
            }else{
                await prisma.project.delete({
                     where: {
                        id : project.id
                     }
                })
            }

            return response.json({message : "Esse projeto foi excluido com sucesso!"})
        }catch{
            throw new AppError('Não foi possível excluir este projeto')
        }
        
    }
    
}