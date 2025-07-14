import express from 'express';
import tourRouter from './routes/tour.routes.js';

const app = express();

app.use(express.json());
const port = 8000;

app.listen(port , (res , req) => {
  console.log(`server is listing on ${port}`);
  
})

// Mount routes
app.use('/api/v1/tours', tourRouter);

export default app;
