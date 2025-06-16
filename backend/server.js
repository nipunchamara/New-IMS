// import dotenv from 'dotenv';
// // dotenv.config();

// import express from 'express';
// import mongoose from 'mongoose';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import userRoute from './routes/userRoute.js';
// import { errorHandler } from './middleWare/errorMiddleware.js';

// dotenv.config();

// const app = express();
// app.use(errorHandler);

// app.use(express.json());

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// // Routes Middleware
// app.use("/api/users", userRoute);

// // Default Route
// app.get("/", (req, res) => {
//   res.send("Home Page");
// });

// const PORT = process.env.PORT || 5000;

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server Running on port ${PORT}`);
//       console.log(process.env.MONGO_URI);
//     });
//   })
//   .catch(err => console.log(err));

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import userRoute from './routes/userRoute.js';
import { errorHandler } from './middleWare/errorMiddleware.js';
import cookieParser from 'cookie-parser';

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use((req, _res, next) => {
  console.log("Incoming Body:", req.body);
  next();
});

// ROUTES
app.use("/api/users", userRoute);

// DEFAULT ROUTE
app.get("/", (_req, res) => {
  res.send("Home Page");
});

// ERROR MIDDLEWARE
app.use(errorHandler);

// SERVER
const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in your environment variables.");
  process.exit(1);  // stop the server if no DB URI is found
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running on port ${PORT}`);
      console.log(`Connected to MongoDB`);
    });
  })
  .catch(err => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });




































  // import dotenv from 'dotenv';
// dotenv.config();

// import express from 'express';
// import mongoose from 'mongoose';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import userRoute from './routes/userRoute.js';

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// // Routes Middleware
// app.use("/api/user ", userRoute);

// // Routes
// app.get("/", (req, res) => {
//   res.send("Home Page")
// });

// const PORT = process.env.PORT || 5000;

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server Running on port ${PORT}`);
//       console.log(process.env.MONGO_URI);
//     });
//   })
//   .catch(err => console.log(err));