import express, { Request, Response } from 'express';
import connectDB from './db';
import router from './router';
import cors from 'cors';
import morgan from 'morgan';

import dotenv from 'dotenv';

const app = express();
dotenv.config();

app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(express.json());
app.use(morgan('dev'));
app.use(router);
app.use('/', async (req: Request<any>, res: Response<any>): Promise<any> => {
  return res.status(404).json({ error: 'Not found'});
});

connectDB().then(() => {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    try {
      console.log('🚀 Server listening at http://localhost:' + PORT);
    } catch (err) {
      console.error('Error starting the server:', err);
    }
  });
});
