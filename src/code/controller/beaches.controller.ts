import { Controller, Post } from "@overnightjs/core";
import { Request, Response } from "express";
import { Beach } from "@src/code/model/beach";
//import  mongoose from "mongoose";

@Controller('beaches')
export class BeachesController{

    @Post('')
    public async create(req: Request, res: Response): Promise<void>{
        
        try{
            const beach = new Beach(req.body);
            const result = await beach.save();

            res.status(201).send(result);
        }
        catch(error){
            res.status(500).send({error: (error as Error).message});
        }
    }
}