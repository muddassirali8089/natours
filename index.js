import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import tourRouter from './routes/tour.routes.js';
import userRouter from './routes/user.routes.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config(); // load config.env
const app = express();


app.use(express.json());
app.use(express.static(`${__dirname}/public`));

console.log("NODE_ENV:", process.env.NODE_ENV);

// ✅ Only use morgan in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log("true..")
}



const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

export default app;
