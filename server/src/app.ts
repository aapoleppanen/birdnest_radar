import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pilotsRouter from './controllers/pilots';
import cacheClient from './services/cache/cache';

dotenv.config();

const app = express();

cacheClient.connect().catch((err) => {
  console.log(err);
});

app.use(express.json());
app.use(cors());

app.use('/pilots', pilotsRouter);

export default app;
