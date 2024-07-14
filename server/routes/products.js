const { Category } = require('../models/categories.js');
const { Product } = require('../models/products.js');
const { RecentlyViewed } = require('../models/recentlyViewed.js');
const { ImageUpload } = require('../models/imageUpload.js');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require("fs");
const mongoose = require("mongoose");
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret,
    secure: true
});

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

// Multer upload instance
const upload = multer({ storage: storage });

// Upload images to Cloudinary and save URLs in database
router.post(`/upload`, upload.array("images"), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, error: 'No files uploaded' });
        }

        const imagesArr = [];
        for (let i = 0; i < req.files.length; i++) {
            const options = {
                use_filename: true,
                unique_filename: false,
                overwrite: false,
            };
            // Upload image to Cloudinary
            const img = await cloudinary.uploader.upload(req.files[i].path, options);
            imagesArr.push(img.secure_url);
            // Delete uploaded image from local storage
            fs.unlinkSync(`uploads/${req.files[i].filename}`);
        }
        // Save uploaded image URLs in ImageUpload model
        let imagesUploaded = new ImageUpload({ images: imagesArr });
        imagesUploaded = await imagesUploaded.save();
        return res.status(200).json(imagesArr);
    } catch (error) {
        console.error('Error uploading images:', error);
        return res.status(500).json({ success: false, error: 'Error uploading images' });
    }
});

// Get products with pagination and filtering
router.get(`/`, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 10;
        let query = {};

        if (req.query.minPrice && req.query.maxPrice) {
            query.price = { $gte: req.query.minPrice, $lte: req.query.maxPrice };
        }

        if (req.query.catId) {
            query.catId = req.query.catId;
        }

        if (req.query.subCatId) {
            query.subCatId = req.query.subCatId;
        }

        if (req.query.location && req.query.location !== "All") {
            query.location = req.query.location;
        }

        const totalPosts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return res.status(404).json({ message: "Page not found" });
        }

        const productList = await Product.find(query)
            .populate("category subCat")
            .skip((page - 1) * perPage)
            .limit(perPage);

        return res.status(200).json({
            products: productList,
            totalPages: totalPages,
            page: page
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Get total count of products
router.get(`/get/count`, async (req, res) => {
    try {
        const productsCount = await Product.countDocuments();
        res.status(200).json({ productsCount: productsCount });
    } catch (error) {
        console.error('Error fetching product count:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Get featured products
router.get(`/featured`, async (req, res) => {
    try {
        let query = { isFeatured: true };
        if (req.query.location && req.query.location !== "All") {
            query.location = req.query.location;
        }
        const productList = await Product.find(query);
        return res.status(200).json(productList);
    } catch (error) {
        console.error('Error fetching featured products:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Get recently viewed products
router.get(`/recentlyViewed`, async (req, res) => {
    try {
        const productList = await RecentlyViewed.find(req.query).populate("category subCat");
        return res.status(200).json(productList);
    } catch (error) {
        console.error('Error fetching recently viewed products:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Add product to recently viewed
router.post(`/recentlyViewed`, async (req, res) => {
    try {
        let findProduct = await RecentlyViewed.findOne({ prodId: req.body.id });
        if (!findProduct) {
            const product = new RecentlyViewed(req.body);
            const savedProduct = await product.save();
            return res.status(201).json(savedProduct);
        }
        return res.status(200).json(findProduct);
    } catch (error) {
        console.error('Error adding product to recently viewed:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Create a new product
router.post(`/create`, async (req, res) => {
    try {
        const category = await Category.findById(req.body.category);
        if (!category) {
            return res.status(404).send("Invalid Category!");
        }

        const images_Array = [];
        const uploadedImages = await ImageUpload.findOne(); // Assuming you only have one set of uploaded images
        if (uploadedImages) {
            images_Array.push(...uploadedImages.images);
        }

        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            images: images_Array,
            brand: req.body.brand,
            price: req.body.price,
            oldPrice: req.body.oldPrice,
            subCatId: req.body.subCatId,
            catId: req.body.catId,
            catName: req.body.catName,
            subCat: req.body.subCat,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            isFeatured: req.body.isFeatured,
            discount: req.body.discount,
            productRam: req.body.productRam,
            size: req.body.size,
            productWeight: req.body.productWeight,
            location: req.body.location,
        });

        const savedProduct = await product.save();
        return res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Get product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("category subCat");
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Delete product
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json({ success: true, message: 'Product deleted' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Update product
router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                subCat: req.body.subCat,
                description: req.body.description,
                images: req.body.images,
                brand: req.body.brand,
                price: req.body.price,
                oldPrice: req.body.oldPrice,
                catId: req.body.catId,
                subCatId: req.body.subCatId,
                catName: req.body.catName,
                category: req.body.category,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                numReviews: req.body.numReviews,
                isFeatured: req.body.isFeatured,
                productRam: req.body.productRam,
                size: req.body.size,
                productWeight: req.body.productWeight,
                location: req.body.location,
            },
            { new: true }
        );
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json({ success: true, message: 'Product updated', product: product });
    } catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;
