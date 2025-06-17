// export const registerUser = async (req, res) => {
//     if (!req.body.email) {
//         res.status(400);
//         throw new Error("Please add an Email");
//     }

//     res.send("Register User");
// };

// // // module.exports = {
// // //     registerUser,
// // // }
// // const registerUser = async (req, res) => {
// //     if (!req.body.email) {
// //         return res.status(400).json({ message: "Please add an Email" });
// //     }

// //     res.status(200).json({ message: "User registered successfully" });
// // };

// // export { registerUser };
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
// import jwt, { TokenExpiredError } from "jsonwebtoken"
import jwt from "jsonwebtoken";
import Token from "../models/tokenModel.js";;
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Register User Controller
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter All Details");
  }

  if (password.length < 8) {
    res.status(400);
    throw new Error("Password must be at least 8 characters");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Email Already Exists");
  }

  const user = await User.create({ name, email, password });

  if (user) {
    const token = generateToken(user._id);
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
      sameSite: "none",
      secure: true,
    });

    const { _id, name, email, phone, bio } = user;
    res.status(201).json({ _id, name, email, phone, bio, token });
  } else {
    res.status(400);
    throw new Error("Invalid User Data");
  }
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Invalid Data add email or password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("User not found. Please Login In");
  }

  const passwordIsCorrect = await bcrypt.compare(password, user.password);
  const token = generateToken(user._id);

  if (user && passwordIsCorrect) {
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
      sameSite: "none",
      secure: true,
    });

    const { _id, name, email, phone, bio } = user;
    res.status(200).json({ _id, name, email, phone, bio, token });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

// Logout
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  res.status(200).json({ message: "Successfully Logged Out" });
});

// Get User Data
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { _id, name, email, phone, bio } = user;
    res.status(200).json({
      _id,
      name,
      email,
      phone,
      bio,
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

// Get Login Status
const loginStatus = asyncHandler(async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.json(false)
  }
  // Verify token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.json(true);
  }
  return res.json(false);

  // res.send("Login Status");
});

// Update User
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { name, email, phone, bio } = user;
    user.email = email,
      user.name = req.body.name || name;
    user.phone = req.body.phone || phone;
    user.bio = req.body.bio || bio;
    // user.photo = req.body.photo || photo;
    // user.name = req.body.name || name;

    const updatedUser = await user.save()
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      bio: updatedUser.bio
    })
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
  // res.send("User Updated");
});

// Change Password
const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { oldPassword, password } = req.body;

  if (!user) {
    res.status(404);
    throw new Error("User not found, Please Login");
  }

  //Validate both fields
  if (!oldPassword || !password) {
    res.status(400);
    throw new Error("Please provide both old and new passwords");
  }

  //Check if old password is correct
  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

  if (passwordIsCorrect) {
    user.password = password;
    await user.save();
    res.status(200).send("Password changed successfully");
  } else {
    res.status(400);
    throw new Error("Old password is incorrect");
  }
});


// Forgot Password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Delete Token if it is alreadt in DB
  let token = await Token.findOne({ userId: user._id })
  if (token) {
    await token.deleteOne()
  }

  // Create Reset Token
  // Create Secure Reset Token
  let resetToken = crypto.randomBytes(32).toString("hex");

                                                      // let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
                                                      // console.log(resetToken);

                                                      // Hash Token Before To DB
                                                      // const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
                                                      // console.log(hashedToken);

  //  Save Token To DB
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  await Token.create({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 1000 * 60 * 30 // 30 mins
  });

  // await new Token({
  //   userId: user._id,
  //   token: hashedToken,
  //   createdAt: Date.now(),
  //   expiresAt: Date.now() + 30 * (60 * 1000) // Thirty Min
  // }).save()

  // Construct Reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`;

  // Reset Email
  const message = `
    <h2>Hello ${user.name}</h2>
    <p>Please use the URL below to reset the Password</p>
    <p>The URL Valid for 30 mins</p>
    
    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

    <p>Regards...</p>
    <p>IMS TEAM</p>
  `;

  const subject = "Password Reset Request"
  const send_to = user.email
  const sent_from = process.env.EMAIL_USER

  try {
    await sendEmail(subject, message, send_to, sent_from)
    res.status(200).json({ success: true, message: "Reset Email Sent" })
  } catch (error) {
    console.error("Nodemailer error:", error);  // <-- Add this line
    res.status(500);
    throw new Error("Email Not Sent, Please Try Again");
  }
  // res.send("Forgot Password");
});

//Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  const userToken = await Token.findOne({
    token: hashedToken,
    expiresAt: { $gt: Date.now() }
  });

  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or Expired Token");
  }

  const user = await User.findById(userToken.userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.password = password;
  await user.save();
  await userToken.deleteOne();

  res.status(200).json({
    message: "Password Reset Successful. Please Login"
  });
});

// res.send("Reset Password")


export { registerUser, loginUser, logout, getUser, loginStatus, updateUser, changePassword, forgotPassword, resetPassword };


























// const forgotPassword = asyncHandler(async (req, res) => {
//   //res.send("Forgot Password");
//   const {email} = req.body
//   const user = await User.findById(email);

//   if (!user) {
//     res.status(404);
//     throw new Error("User not found");
//   }

//   // Create Reset Token
//   let resetToken = crypto.randomBytes(32).toString("hex") + user._id

//   console.log(resetToken);
//   res.send("Forgpt Password")

//   // //Validate both fields
//   // if (!oldPassword || !password) {
//   //   res.status(400);
//   //   throw new Error("Please provide both old and new passwords");
//   // }

//   // //Check if old password is correct
//   // const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

//   // if (passwordIsCorrect) {
//   //   user.password = password;
//   //   await user.save();
//   //   res.status(200).send("Password changed successfully");
//   // } else {
//   //   res.status(400);
//   //   throw new Error("Old password is incorrect");
//   // }
// });















// const changePassword = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id);
//     const { oldPassword, password } = req.body

//     if(!user) {
//       res.status(404);
//       throw new Error("User not found, Please Login");
//     }

//     // Validate
//     if(!oldPassowrd, password) {
//       res.status(404);
//       throw new Error("Add Old & New Password");
//     }

//     // Check password is correct
//     const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password)

//     // Save New Passowrd
//     if (user && passwordIsCorrect){
//       user.password = password
//       await user.save()
//       res.status(200).send("Password Saved Successfull")
//     } else {
//       res.status(404);
//       throw new Error("Old Password is Incorrect");
//     }
//   // res.send("User Updated");
// });

// res.send("Password Changed");

















// const { email } = req.body;

// if (!email) {
//   // Correctly return 400 if email is missing
//   res.status(400);
//   throw new Error("Please add an Email");
// }

// res.status(200).json({ message: "User registered successfully" });