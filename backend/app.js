import express from 'express';
import cors from 'cors';
import loginRouter from './routes/login.js';
import geoRouter from './routes/geo.js';
import dotenv from 'dotenv';


dotenv.config();
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/api', loginRouter);
app.use('/api', geoRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`SERVER RUNNING`);
});
