import mongoose, { ConnectOptions  } from 'mongoose';
import { MONGO_URI } from '../config';


export default async() => {
    try {

        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true
        } as ConnectOptions)
        
        console.log("DB Connected")
        
    } catch (err) {
        console.log(err);
    }
}





