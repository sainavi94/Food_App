import { Request, Response, NextFunction } from 'express';
import { VandorLoginInput, EditVandorInputs, CreateFoodInput } from '../dto/index';
import { VandorFind } from './AdminController';
import { validatePassword,GenerateSignature } from '../utility/index';
import { Food } from '../models';

 
export const VandorLogin = async(req: Request, res: Response, next: NextFunction) => {

    const { email, password } = <VandorLoginInput>req.body;

    const existVandor = await VandorFind('',email);

    if(existVandor !== null) {

        const validation = await validatePassword(password,existVandor.salt,existVandor.password);

        if(validation) {
            const signature = await GenerateSignature({
                _id: existVandor.id,
                email: existVandor.email,
                name: existVandor.name,
                foodTypes: existVandor.foodTypes
            });
            return res.json({signature});
        } else {
            return res.json({message:"Password is not valid"});
        }
    } 

    return res.json({message:"Login credential is not valid"});

};

export const GetVandorProfile = async(req: Request, res: Response, next: NextFunction) => {
    
    const user = req.user;

    if(user) {
        const existVandor = await VandorFind(user._id);
        return res.json(existVandor);
    }

    return res.json({message: "Vandor Profile found"});

};

export const UpdateVandorProfile = async(req: Request, res: Response, next: NextFunction) => {

    const { name, address, foodTypes, phone } = <EditVandorInputs>req.body;
    const user = req.user;

    if(user) {
        const existVandor = await VandorFind(user._id);

        if(existVandor !== null) {
            existVandor.name = name;
            existVandor.foodTypes = foodTypes;
            existVandor.address = address;
            existVandor.phone = phone;

            const savedResults = await existVandor.save();
            return res.json(savedResults);
        }

        
    }

    return res.json({message:"Vandor Profile not updated"});
};

export const UpdateVandorService = async(req: Request, res: Response, next: NextFunction) => {

    const { name, address, foodTypes, phone } = <EditVandorInputs>req.body;
    const user = req.user;

    if(user) {
        const existVandor = await VandorFind(user._id);

        if(existVandor !== null) {
            existVandor.serviceAvailable = !existVandor.serviceAvailable;
            const savedResults = await existVandor.save();
            return res.json(savedResults);
        }
    }

    return res.json({message:"Vandor Profile not updated"});
};

export const AddFood = async(req: Request, res: Response, next: NextFunction) => {

    const user = req.user;

    if(user) {

        const { name, description, price, category, foodType, readyTime } = <CreateFoodInput>req.body;

        const vandor = await VandorFind(user._id);

        if(vandor !== null) {

            const files = req.files as [Express.Multer.File];
            console.log("files.....",files);

            const images = files.map((file:Express.Multer.File) => file.filename)
            console.log("images......",images);
            const createFood = await Food.create({
                vandorId: vandor._id,
                name,
                description,
                price,
                category,
                foodType,
                readyTime,
                rating:0,
                images:images
            });

            vandor.foods.push(createFood);

            const result = await vandor.save();
            return res.json(result);
         }
    }
    
};
 
export const GetFoods = async(req: Request, res: Response, next: NextFunction) => {

    const user = req.user;

    if(user) {

        const foods = await Food.find({vandorId: user._id});

        if(foods !== null){
            return res.json(foods);
        }
    }

    return res.json({message: "Can't find Foods"});
};
 
export const UpdateVandorCoverImage = async(req: Request, res: Response, next: NextFunction) => {

        const user = req.user;

        if(user) {

            const vandor = await VandorFind(user._id);
    
            if(vandor !== null) {
    
                const files = req.files as [Express.Multer.File];
                console.log("files.....",files);

                const images = files.map((file:Express.Multer.File) => file.filename)
                console.log("images......",images);
    
                vandor.coverImages.push(...images);
    
                const result = await vandor.save();
                return res.json(result);
             }
        }

        return res.json({message:"Can't upload Images"});
};
