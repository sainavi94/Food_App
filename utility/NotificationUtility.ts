



/** OTP */
export const GenerateOTP = async () => {

    return  Math.floor(100000 + Math.random() * 900000);
}

export const ExpiryOTP = async() => {
    const expiry = new Date();
    expiry.setTime(new Date().getTime() + (30*60*1000));
    return expiry;
};

export const onRequestOTP = async(otp:number, toPhoneNumber:string) => {

    const accountSid = '';
    const authToken = '';
    const client = require('twilio')(accountSid,authToken);

    const response = await client.messages.create({
        body: `Your OTP is ${otp} `,
        from: '+19793106300',
        to: `+91${toPhoneNumber}`
    });

    return response;
}
