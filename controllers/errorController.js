const sendErrorDev = (res, error) => {
  res.status(error.statusCode).json({
    status: error.status,
    error,
    message: error.message,
    stack: error.stack,
  });
};

const sendErrorProd = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    console.error("Error 💥", error);
    res.status(500).json({
      status: "error",
      message: "something went wrong",
    });
  }
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(res, error);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorProd(res, error);
  }
};
