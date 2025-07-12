import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './api/auth.routes';
import userRoutes from './api/user.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});