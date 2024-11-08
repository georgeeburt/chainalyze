import express, { Request, Response } from 'express';
import cors from 'cors';

import dotenv from 'dotenv';
import router from './router';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(express.json());

app.use(router);
app.use('/', async (req: Request<any>, res: Response<any>): Promise<any> => {
  return res.status(404).json({ error: 'Not found'});
});

app.listen(PORT, () => {
  try {
    console.log('🚀 Server listening at http://localhost:' + PORT);
  } catch (err) {
    console.error('Error starting the server:', err);
  }
});