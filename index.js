import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import helmet from "helmet";
import path from "path";
import cors from "cors";
import hpp from "hpp";
import { FilterXSS } from 'xss';
import sanitize from 'mongo-sanitize';
import { fileURLToPath } from "url";
import AppError from "./utils/AppError.js";
import tourRouter from "./routes/tour.routes.js";
import userRouter from "./routes/user.routes.js";
import reviewRouter from "./routes/review.routes.js";
import connectDB from "./connection/connectDB.js";
import globalErrorHandler from "./controllers/globalErrorHandler.js";
import { generalLimiter, loginLimiter } from "./utils/rateLimiters.js";

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
app.use(helmet());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS configuration for development
app.use(cors({
  origin: process.env.FRONTEND_URL, // Frontend URL
  credentials: true, // Allow credentials (cookies, authorization headers)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // For legacy browser support
}))
app.use(express.json({ limit: "10kb" }));


app.use((req, res, next) => {
  ['body', 'query', 'params'].forEach(key => {
    if (req[key]) {
      Object.keys(req[key]).forEach(prop => {
        req[key][prop] = sanitize(req[key][prop]);
      });
    }
  });
  next();
});


const xssFilter = new FilterXSS({
  whiteList: {}, // empty means filter ALL tags
  stripIgnoreTag: true, // filter all HTML
  stripIgnoreTagBody: ['script'] // especially script tags
});

app.use((req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      req.body[key] = xssFilter.process(req.body[key]);
    });
  }
  next();
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(generalLimiter);

app.use(hpp({
  whitelist: ['sort']
}));

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

app.use("/api/v1/users", userRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/reviews", reviewRouter);

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
