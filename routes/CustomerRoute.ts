import express from 'express';
import { CustomerSignUp, CustomerLogin, CustomerVerify, RequestOTP, GetCustomerProfile, EditCustomerProfile } from '../controller/index';
import { Authenticate } from '../middlewares/index';
const router = express.Router();

/** Sign-up/Create Customer */
router.post('/signup',CustomerSignUp);

/** Login */
router.post('/login',CustomerLogin);


router.use(Authenticate);
/** Verify Customer Account */
router.patch('/verify',CustomerVerify);

/** OTP- Requesting */
router.get('/otp',RequestOTP);

/** Profile */
router.get('/profile',GetCustomerProfile);

/** Update Profile */
router.patch('/profile',EditCustomerProfile);



export {router as CustomerRoute }