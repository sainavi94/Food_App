import { Request, Response, NextFunction } from 'express';
import { Vandor, FoodDoc } from '../models/index';

export const GetFoodAvailability = async(req: Request, res: Response, next: NextFunction) => {

    const pincode = req.params.pincode;

    const result = await Vandor.find({pincode:pincode, serviceAvailable: false})
    .sort([['rating','descending']])
    .populate('foods')

    if(result.length > 0) {
        return res.status(200).json(result)
    }

    return res.status(400).json({message:"Data not found.."})

};

export const GetTopRestaurants = async(req: Request, res: Response, next: NextFunction) => {

    const pincode = req.params.pincode;

    const result = await Vandor.find({pincode:pincode, serviceAvailable: false})
    .sort([['rating','descending']])
    // .select('rating')
    // .sort('-1')
    .limit(1)

    if(result.length > 0) {
        return res.status(200).json(result)
    }

    return res.status(400).json({message:"Data not Found"})
};

export const GetFoodsIn30mins = async(req: Request, res: Response, next: NextFunction) => {

    const pincode = req.params.pincode;

    const result = await Vandor.find({pincode:pincode, serviceAvailable: false,readyTime:{$lte:30}})
    .populate('foods');

    // if(result.length > 0) {

    //     let foodResult : any = [];

    //     result.map(vandor => {
    //         const foods = vandor.foods as [FoodDoc];
    //         foodResult.push(foods.filter(food => food.readyTime <= 30));
    //     })

    //     return res.status(200).json(foodResult);
    // }

    // return res.status(400).json({message: "Data not found.."})
    return res.json(result)
};

export const SearchFoods = async(req: Request, res: Response, next: NextFunction) => {

    const pincode = req.params.pincode;

    const result = await Vandor.find({pincode:pincode, serviceAvailable: false})
    .populate('foods')
    // .select('foods')

    if(result.length > 0) {

        let foodResult: any = [];

        result.map(item => foodResult.push(...item.foods))

        return res.status(200).json(foodResult);
    }

    return res.status(400).json({message: "Data not found"});
    // return res.send(result)
};

export const RestaurantByID = async(req: Request, res: Response, next: NextFunction) => {

    const id = req.params.id;

    const result = await Vandor.findById(id).populate('foods');

    if(result !== null) {
        return res.status(200).json(result)
    }

    return res.status(400).json({message:"Data not found"})

};