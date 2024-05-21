import express from 'express'; 
import { GetFoodAvailability, GetTopRestaurants, GetFoodsIn30mins, SearchFoods, RestaurantByID  } from '../controller/index';

const router = express.Router();


/** Food Availability */
router.get('/:pincode',GetFoodAvailability);

/** Top Restaurants */
router.get('/top-restaurants/:pincode',GetTopRestaurants);

/** Food Availability in 30-mins */
router.get('/foods-in-30-min/:pincode',GetFoodsIn30mins);

/** Search Foods */
router.get('/search/:pincode',SearchFoods);

/** Find Restaurant By ID */
router.get('/restaurant/:id',RestaurantByID);

export { router as ShoppingRoute };