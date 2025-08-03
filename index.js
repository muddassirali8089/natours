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

// ✅ Catch uncaught exceptions (e.g., console.log(nonExistentVar))
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

dotenv.config(); // Load config.env
const app = express();

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ✅ Connect to DB
await connectDB();

// ✅ Custom middleware to add request time
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ✅ API Routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// ✅ 404 for undefined routes
// Catch-all route for undefined routes
app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// ✅ Global error handler
app.use(globalErrorHandler);

const port = process.env.PORT || 8000;

// ✅ Start the server
const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// ✅ Handle unhandled promise rejections (e.g., DB connection fails)
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err.name, err.message);

  // First close the server, then exit process
  server.close(() => {
    process.exit(1);
  });
});

export default app;
