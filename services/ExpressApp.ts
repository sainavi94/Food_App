import express,{ Application } from 'express';
import { AdminRoute, VandorRoute, ShoppingRoute, CustomerRoute} from '../routes/index';
import path from 'path';



export default async(app:Application) => {

    app.use(express.json());
    app.use(express.urlencoded({ extended:true }));
    app.use('/images',express.static(path.join(__dirname,'/images')));

    app.use('/admin',AdminRoute);
    app.use('/vandor',VandorRoute);
    app.use('/customer',CustomerRoute)
    app.use('/shoping',ShoppingRoute);

    return app;
}




