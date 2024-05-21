import express, { Request, Response, NextFunction } from 'express';
import { VandorLogin, GetVandorProfile, UpdateVandorProfile, UpdateVandorService, AddFood, GetFoods, UpdateVandorCoverImage } from '../controller/index';
import { Authenticate } from '../middlewares/index';
import { images } from '../utility';
const router = express.Router();


router.post("/login",VandorLogin);


router.get('/profile',Authenticate,GetVandorProfile);
router.patch('/profile',Authenticate,UpdateVandorProfile);
router.patch('/service',Authenticate,UpdateVandorService);

router.post("/food",Authenticate,images,AddFood);
router.get("/food",Authenticate,GetFoods);
router.patch('/coverimage',Authenticate,images,UpdateVandorCoverImage);



export { router as VandorRoute };