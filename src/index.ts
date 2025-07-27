import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import userRoutes from './api/user.routes';
import vocabularyRoutes from "./api/vocabulary.routes";
import categoryRoutes from './api/dictionary_category.routes';
import levelRoutes from './api/level.routes';
import exerciseRoutes from './api/exercise.route';
import lessonRoutes from "./api/lesson.routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/vocabularies', vocabularyRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/lessons', lessonRoutes);
app.use('/api/v1/levels', levelRoutes);
app.use('/api/v1/exercises', exerciseRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});