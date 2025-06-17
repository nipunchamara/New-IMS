import express from "express";
const router = express.Router();

import {
    registerUser,
    loginUser,
    logout,
    getUser,
    loginStatus,
    updateUser,
    changePassword,
    forgotPassword,
    resetPassword
} from "../controllers/userController.js";

import { protect } from "../middleWare/authMiddleware.js";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.get("/getUser", protect, getUser);
router.get("/loggedin", loginStatus);
router.patch("/updateuser", protect, updateUser);
router.patch("/changepassword", protect, changePassword);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);


export default router;




















// import express from 'express';
// const router = express.Router();
// // import { registerUser } from '../controllers/userController.js';
// import { registerUser, loginUser, logout, getUser, loginStatus} from '../controllers/userController.js';
// import { protect } from "../middleWare/authMiddleware.js";


// router.post("/register", registerUser);
// router.post("/login", loginUser);
// router.get("/logout", logout);
// router.get("/getUser", protect, getUser);
// router.get("/loggedin", loginStatus);



// // export { registerUser, loginUser };
// export default router; 