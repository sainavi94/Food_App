import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { VandorPayload,CustomerPayload } from '../dto/index';
import { JWT_SIGN } from '../config/index';
import { Request } from 'express';
import { AuthPayload } from '../dto/index';

export const GenerateSalt = async () => {
    return await bcryptjs.genSalt()
};

export const GeneratePassword = async(password: string, salt:string) => {
    return await bcryptjs.hash(password,salt);
};

export const validatePassword = async(enteredpassword:string,salt:string,savedpassword:string) => {
    return await GeneratePassword(enteredpassword,salt) === savedpassword;
};

export const GenerateSignature = async(payload:VandorPayload | CustomerPayload) => {
    return jwt.sign(payload,JWT_SIGN,{
        expiresIn: '1h'
    });
};

export const ValidateSignature = async(req: Request) => {

    const signature = req.headers.authorization;

    if(signature) {

        const payload = await jwt.verify(signature.split(' ')[1],JWT_SIGN) as AuthPayload;

        req.user = payload;
        return true;
    }

    return false;
}