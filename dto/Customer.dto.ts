import { IsEmail, IsEmpty, Length } from "class-validator";

export class CreateCustomerInput {

    @IsEmail()
    email: string;

    @Length(7,12)
    phone:string;

    @Length(6,12)
    password:string;
};

export class LoginCustomerInput {

    @IsEmail()
    email: string;


    @Length(6,12)
    password:string;
};

export class EditCustomerInput {



    @Length(3,12)
   firstName: string;

   @Length(3,12)
   lastName:string;

   @Length(6,12)
    address: string;
};

export interface CustomerPayload {
    _id: string,
    email: string,
    verified: boolean
}