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
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

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

export { registerUser, loginUser, logout, getUser, loginStatus, updateUser, changePassword };













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