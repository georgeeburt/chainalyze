import express, { Request, Response } from 'express';
import connectDB from './db';
import router from './router';
import cors from 'cors';
import morgan from 'morgan';

import dotenv from 'dotenv';

const app = express();
dotenv.config();

app.use(cors({
  origin: process.env.CLIENT_ENDPOINT
}));
app.use(express.json());
app.use(morgan('dev'));
app.use(router);
app.use('/', async (req: Request<any>, res: Response<any>): Promise<any> => {
  return res.status(404).json({ error: 'Not found'});
});

if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log('🚀 Server listening at http://localhost:' + PORT);
    });
  });
}

export default app;
