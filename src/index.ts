import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import authRoutes from './api/auth.routes';
import userRoutes from './api/user.routes';
import vocabularyRoutes from "./api/vocabulary.routes";
import categoryRoutes from './api/category.routes';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use("/api/vocabularies", vocabularyRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});