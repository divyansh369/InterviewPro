import {  requireAuth,getAuth } from '@clerk/express'
import { User } from '../models/User.js';

export const protectedRoute = [
    // requireAuth will ensure the user is authenticated, if not it will redirect to the sign-in page
    requireAuth(),
    async (req,res,next) => {
        try {
            const clerkId = req.auth().userId;

            if(!clerkId){
                return res.status(401).json({msg:"Unauthorized - No user ID found in auth token"});
            }
            const user = await User.findOne({clerkId});

            if(!user){
                return res.status(404).json({msg:" No user found with the provided ID"});
            }
            req.user = user;
            next();
        } catch (error) {
            return res.status(500).json({msg:"Internal server error"});
        }
    }

]