import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRouter from './routes/health';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health check route
app.use('/api/health', healthRouter);

app.get('/', (req, res) => {
  res.send('Supply Chain Reasoning API is running.');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
