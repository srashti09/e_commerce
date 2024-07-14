const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');

// CORS setup
app.use(cors());
app.options('*', cors());

// Middleware setup
app.use(bodyParser.json());
app.use(express.json());

// Routes setup
const userRoutes = require('./routes/user.js');
const categoryRoutes = require('./routes/categories');
const subCatRoutes = require('./routes/subCat.js');
const productRoutes = require('./routes/products');
const imageUploadRoutes = require('./helper/imageUpload.js');
const productWeightRoutes = require('./routes/productWeight.js');
const productRAMSRoutes = require('./routes/productRAMS.js');
const productSIZESRoutes = require('./routes/productSIZE.js');
const productReviews = require('./routes/productReviews.js');
const cartSchema = require('./routes/cart.js');
const myListSchema = require('./routes/myList.js');
const ordersSchema = require('./routes/orders.js');
const homeBannerSchema = require('./routes/homeBanner.js');
const searchRoutes = require('./routes/search.js');

// Route middleware
app.use("/api/user", userRoutes);
app.use("/uploads", express.static("uploads"));
app.use(`/api/category`, categoryRoutes);
app.use(`/api/subCat`, subCatRoutes);
app.use(`/api/products`, productRoutes);
app.use(`/api/imageUpload`, imageUploadRoutes);
app.use(`/api/productWeight`, productWeightRoutes);
app.use(`/api/productRAMS`, productRAMSRoutes);
app.use(`/api/productSIZE`, productSIZESRoutes);
app.use(`/api/productReviews`, productReviews);
app.use(`/api/cart`, cartSchema);
app.use(`/api/my-list`, myListSchema);
app.use(`/api/orders`, ordersSchema);
app.use(`/api/homeBanner`, homeBannerSchema);
app.use(`/api/search`, searchRoutes);

// Database connection
mongoose.connect(process.env.CONNECTION_STRING)
    .then(() => {
        console.log('Database Connection is ready...');
        // Start server
        app.listen(process.env.PORT, () => {
            console.log(`Server is running at http://localhost:${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error connecting to database:', err);
    });
