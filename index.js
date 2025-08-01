import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import AppError from "./utils/AppError.js";

import tourRouter from "./routes/tour.routes.js";
import userRouter from "./routes/user.routes.js";
import connectDB from "./connection/connectDB.js";

import globalErrorHandler from "./controllers/globalErrorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config(); // load config.env
const app = express();

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// ✅ Only use morgan in development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

await connectDB();

const port = process.env.PORT || 8000;



app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});




app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);



// 404 error handler for invalid routes
app.all(/\/*/, (req, res , next) => { 

  const err = new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  
  // err.statusCode = 404;
  // err.status = "fail";

  next(err)
  // <-- This is the safe alternative
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`
  // });
});


app.use(globalErrorHandler)

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

export default app;


