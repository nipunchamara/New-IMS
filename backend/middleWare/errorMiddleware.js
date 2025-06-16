const errorHandler = (err, _req, res, _next) => {
  console.log("Error Handler Called");
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("Error Stack:", err.stack);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  const payload = {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  };

  res.status(statusCode).json(payload);
};

export { errorHandler };

















// const errorHandler = (err, _req, res, _next) => {
//   const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

//   const payload = {
//     message: err.message,
//     stack: process.env.NODE_ENV === "development" ? err.stack : null,
//   };

//   res.status(statusCode).json(payload);
// };

// export { errorHandler };

// const errorHandler = (err, req, res, next) => {
//   const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

//   res.status(statusCode).json({
//     message: err.message,
//     stack: process.env.NODE_ENV === "production" ? null : err.stack,
//   });
// };

// const errorHandler = (err, req, res, next) => {
//   const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

//   res.status(statusCode).json({
//     message: err.message,
//     stack: process.env.NODE_ENV === "production" ? null : err.stack,
//   });
// };

// 

