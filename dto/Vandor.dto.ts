export interface CreateVandorInput {
    name: string;
    RestaurantName: string;
    foodTypes: [string];
    pincode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
};


export interface VandorLoginInput {
    email: string;
    password: string;
};

export interface VandorPayload {
    _id: string;
    email: string;
    name: string;
    foodTypes: [string];
};

export interface EditVandorInputs {
    name: string;
    address: string;
    phone : string;
    foodTypes : [string]

};