// import User from "../models/userModel.js";
// import asyncHandler from "express-async-handler";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";

// const protect = asyncHandler(async (res, req, next) => {
//     try {
//         const {token} = req.cookie
//         if (!token) {
//             res.statusCode(401)
//             throw new Error("Not autherized, please login")
//         }

//         // Verify Tiken
//         const Verify = jwt.verifyj(token, process.env.JWT_SECRET)
//         // Get User ID From Token
//         user = await User.findById(verified.id).select("-password")

//         if (!user) {
//             res.statusCode(401)
//             throw new Error("User Not Found")
//         }
//         req.user = user
//         next()
//     } catch (error) {
//         res.statusCode(401)
//         throw new Error("Not autherized, please login")
//     }
// });

import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.cookies && req.cookies.token) {
        try {
            // Get token from cookies
            token = req.cookies.token;

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user without the password
            const user = await User.findById(decoded.id).select("-password");

            if (!user) {
                res.status(401);
                throw new Error("User Not Found");
            }

            // Attach user to request
            req.user = user;

            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, Please Login");
        }
    } else {
        res.status(401);
        throw new Error("Not authorized, Please Login");
    }
});

export { protect };

