import {Request, Response, NextFunction } from 'express';
import { CreateVandorInput } from '../dto/index';
import { Vandor } from '../models/index';
import { GenerateSalt, GeneratePassword } from '../utility/index';


export const VandorFind = async(id:string | undefined, email?:string) => {
    
    if(email) {
        return await Vandor.findOne({email:email})
    } else {
        return await Vandor.findById(id);
    }
}


export const CreateVandor = async (req: Request, res: Response, next: NextFunction) => {
    const { name,RestaurantName,foodTypes,pincode,address,phone,email,password } = <CreateVandorInput>req.body;

    const existVandor = await VandorFind('',email)
    if(existVandor !== null){
        return res.json({message:"A vandor is already exist.."})
    }

    const salt = await GenerateSalt();
    const passwordhash = await GeneratePassword(password,salt);
    const CreateVandor = await Vandor.create({
        name,
        RestaurantName,
        foodTypes,
        pincode,
        address,
        phone,
        email,
        password: passwordhash,
        salt: salt,
        rating:0,
        serviceAvailable: false,
        coverImages: [],
        foods:[]
    });

    return res.json(CreateVandor);
};

export const GetVandors = async (req: Request, res: Response, next: NextFunction) => {
    
    const vandors = await Vandor.find();
    if(vandors !== null) {
        return res.json(vandors);
    }

    return res.json({message: "Vendors not found in DB"})
    

};

export const GetVandorByID = async (req: Request, res: Response, next: NextFunction) => {

    const vandorId = req.params.id
    const vandor = await VandorFind(vandorId);

    if(vandor !== null) {
        return res.json(vandor);
    }

    return res.json({message:"Vandor not found"});

};

 