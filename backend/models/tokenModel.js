import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    token: {
      type: String,
      required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true
    }
      
  });
  

export const Token = mongoose.model("Token", tokenSchema);
export default Token;














// import mongoose from "mongoose";

// const tokenSchema = mongoose.Schema({
//     userId: { 
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         ref: "user"
//     },
//     token: {
//         type: String,
//         required: true
//     },
//     createdAt: {
//         type: Date,
//         required: true,
//     },
    
// })

// // const Token = mongoose.model("Token", tokenSchema)

// // module.exports = Token