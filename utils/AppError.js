// utils/appError.js
export default class AppError extends Error {

  
   
  constructor(message, statusCode) {

    
    super(message); // this.message = message

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    // ✅ This marks the error as expected and safe
    this.isOperational = true;

    // ✅ Removes this class from the stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}
