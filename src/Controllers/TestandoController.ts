import { Request, Response } from "express";

export class TestandoController{
    async index(request :Request, response :Response){
        const {name, email} = request.body;


        return response.json({name, email})
    }
}