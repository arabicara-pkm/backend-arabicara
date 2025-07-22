import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API Arabicara',
        version: '1.0.0',
        description: 'Dokumentasi REST API Arabicara menggunakan Express.js dan Swagger.',
    },
    servers: [
        {
            url: `http://localhost:${process.env.PORT || 3000}/api/v1`,
            description: 'Development Server',
        },
        {
            url: `https://production-path/api/v1`,
            description: 'Production Server',
        },
    ],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    security: [
        {
            BearerAuth: [], // Mengaplikasikan JWT secara global (bisa di-override per endpoint)
        },
    ],
};

const options: swaggerJSDoc.Options = {
    swaggerDefinition,
    // Path ke file-file API yang ingin didokumentasikan
    apis: ['./src/api/*.ts', './src/schemas/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;