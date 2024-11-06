import express from 'express';
import cors from 'cors';

import router from './router';

const app = express();
const PORT = 3000;

app.use(cors())
app.use(express.json());

app.use(router);
app.use(function(req, res){
  return res.status(404).json({ error: 'Not found'});
});

app.listen(PORT, () => {
  try {
    console.log('🚀 Server listening at http://localhost:' + PORT);
  } catch (err) {
    console.error('Error starting the server:', err);
  }
});