const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();

// راه‌اندازی میدلور‌ها
app.use(cors());
app.use(express.json());

// تنظیمات Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Shop API',
            version: '1.0.0',
            description: 'API Documentation for Shop Project',
        },
        servers: [
            {
                url: 'http://localhost:5000', // آدرس سرور
            },
        ],
    },
    apis: ['./routes/*.js'], // مسیری که فایل‌های API شما قرار دارند
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// نمایش مستندات Swagger در مسیر `/api-docs`
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// تنظیم مسیرهای API
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// اجرای سرور
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
