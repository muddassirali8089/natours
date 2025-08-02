const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err, // full error object
    message: err.message,
    stack: err.stack, // helpful for debugging
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error (e.g. custom errors from your app logic)
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message, // clean message for client
    });
  } else {
    // Programming or unknown errors
    console.error("ERROR 💥:", err);

    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!', // generic message for security
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(err, res);
  }
};

export default globalErrorHandler;
