import express from 'express';
import morgan from 'morgan';
import tourRouter from './routes/tour.routes.js';
import userRouter from "./routes/user.routes.js"

const app = express();
app.use(morgan("dev"))

app.use(express.json());
const port = 8000;

app.listen(port , (res , req) => {
  console.log(`server is listing on ${port}`);
  
})

// Mount routes






app.use((req , res , next) => {
  req.requestTime = new Date().toISOString();
  next();
})
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

export default app;
