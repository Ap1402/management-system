const errorMiddleware = (error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Something went wrong";

  if (
    error.name === "MongoError" &&
    error.code === 11000 &&
    error.keyPattern.email
  )
    return res
      .status(409)
      .json({ status: 409, message: "Email is already registered" });

  res.status(status).json({
    status: status,
    message: message,
  });
};

module.exports = errorMiddleware;
