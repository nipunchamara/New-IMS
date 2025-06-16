// const mongoose = require("mongoose")

// const userSchema = mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, "Please Enter Your Name"]
//     },
//     email: {
//         type: String,
//         required: [true, "Please Enter Your Email"],
//         unique: true,
//         trim: true,
//         match: [
//             /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
//             "Please Enter a valid Email"
//         ]
//     },
//     password: {
//         type: String,
//         required: [true, "Please Enter Your Password"],
//         minLength: [8, "Password must be up to 8 chracters"],
//         maxLength: [12, "Password must not be more than 12 chracters"]
//     },
//     photo: {
//         type: String,
//         required: [true, "Please Enter Your Photo"],
//         default: "C:\Users\nipun\Pictures\'BISATRON'.jpg",
//     },
//     phone: {
//         type: String,
//         default: "+12345678",
//     },
//     bio: {
//         type: String,
//         maxLength: [250, "Password must not be more than 250 chracters"],
//         default: "+12345678",
//     }
// }, 
// {
//     timestamps: true,
// }
// );

// const User = mongoose.model("User", userSchema)
// export default User

import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"]
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please Enter a valid Email"
        ]
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password must be at least 8 characters"],
        //maxLength: [18, "Password must not be more than 12 characters"]
    },
    photo: {
        type: String,
        default: "C:\\Users\\nipun\\Pictures\\BISATRON.jpg"
    },
    phone: {
        type: String,
        default: "+12345678"
    },
    bio: {
        type: String,
        maxLength: [250, "Bio must not be more than 250 characters"],
        default: "Hello! I am new here."
    }
}, {
    timestamps: true
});


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


const User = mongoose.model("User", userSchema);
export default User;







// // Enctrypt
// userSchema.pre("save", async function (next) {

//     if(this.isModified("password")){
//         return next();
//     }

//     const salt = await bcrypt.genSalt(10)
//     const hashedPassword = await bcrypt.hash(this.password, salt);
//     this.password = hashedPassword;
//     next();

// })

// Encrypt password before saving