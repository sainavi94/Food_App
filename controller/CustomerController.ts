import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { CreateCustomerInput,LoginCustomerInput, EditCustomerInput } from '../dto/index';
import { Customer } from '../models/index';
import { GenerateSalt, GeneratePassword, GenerateOTP, ExpiryOTP, onRequestOTP, validatePassword, GenerateSignature } from '../utility/index';


export const CustomerSignUp = async(req: Request, res: Response, next:NextFunction) => {

    const customerInputs = plainToClass(CreateCustomerInput,req.body);

    const inputErrors = await validate(customerInputs,{validationError: {target:true}});

    if(inputErrors.length > 0){
        return res.status(400).json(inputErrors)
    }

    const { email, phone, password } = customerInputs;

    const salt = await GenerateSalt();
    const passwordhash = await GeneratePassword(password,salt);

    const otp = await GenerateOTP();
    const expiry = await ExpiryOTP();

    const existCustomer = await Customer.findOne({email: email});
    if(existCustomer !== null) {
        return res.status(400).json({message:"Customer Already Exist..."})
    }

    const result = await Customer.create({
        email,
        phone,
        password: passwordhash,
        salt,
        otp:otp,
        otp_expiry:expiry,
        fitstName:'',
        lastName:'',
        verified: false,
        lat:0,
        lng:0
    });

    if(result) {
        /** send OTP */
        await onRequestOTP(otp,phone);
    
        return res.status(201).json(result);
    }

    return res.status(400).json({message:"Customer not Created"})


};

export const CustomerLogin = async(req: Request, res: Response, next:NextFunction) => {

    const loginInputs = plainToClass(LoginCustomerInput,req.body);
    const inputErrors = await validate(loginInputs,{validationError: {target:true}});

    if(inputErrors.length > 0){
        return res.status(400).json(inputErrors)
    }

    const { email, password } = loginInputs;

    const existCustomer = await Customer.findOne({email:email});

    if(existCustomer !== null) {


        const verify = await validatePassword(password,existCustomer.salt,existCustomer.password);

        if(verify) {
            const signature = await GenerateSignature({
                _id: existCustomer.id,
                email: existCustomer.email,
                verified: existCustomer.verified
            });
            return res.status(200).json({signature})
        } else {
            return res.status(400).json({message: "Login credential is invalid"})
        }
    }
    return res.status(400).json({message:"Customer is not found"})

};

export const CustomerVerify = async(req: Request, res: Response, next:NextFunction) => {

    const { otp } = req.body;
    const customer = req.user;

    if(customer) {

        const profile = await Customer.findById(customer._id);

        if(profile) {

            if(profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
                profile.verified = true;

                const updateCustomerResponse = await profile.save();

                return res.status(200).json({updateCustomerResponse});
            }
        }
    }
    return res.status(400).json({message:"Can't Update Customer"});

};

export const RequestOTP = async(req: Request, res: Response, next:NextFunction) => {

    const customer = req.user;

    if(customer) {

        const profile = await Customer.findById(customer._id);

        if(profile){

            const otp = await GenerateOTP();
            const expiry = await ExpiryOTP();

            profile.otp = otp;
            profile.otp_expiry = expiry;

            await profile.save();
            await onRequestOTP(otp,profile.phone);

            return res.status(200).json({message: "OTP Sent your registered mobile"})
        }
    }

    return res.status(400).json({message:"Error with OTP"})
};

export const GetCustomerProfile = async(req: Request, res: Response, next:NextFunction) => {

    const customer = req.user;

    if(customer) {

        const result = await Customer.findById(customer._id);
        return res.status(200).json(result)
    }
    return res.status(400).json({message:"Customer not Found"})

};

export const EditCustomerProfile = async(req: Request, res: Response, next:NextFunction) => {

    const customer = req.user;

    if(customer) {

        const CustomerInputs = plainToClass(EditCustomerInput,req.body);
        const inputErrors = await validate(CustomerInputs,{validationError: {target:true}});

        if(inputErrors.length > 0){
             return res.status(400).json(inputErrors)
        }

        const { firstName, lastName, address } = CustomerInputs;

        const profile = await Customer.findById(customer._id);

        if(profile){

            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;

            const result = await profile.save();
            return res.status(200).json(result)
        }
    }

    return res.status(400).json({message:"Can't edit Profile"})
};