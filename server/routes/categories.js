const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const { Category } = require('../models/categories');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads'),
    filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});

const upload = multer({ storage });

// Helper function to get public ID from Cloudinary URL
const getPublicIdFromUrl = (url) => {
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    return lastPart.split('.')[0];
};

// POST route to upload images to Cloudinary and create a new category
router.post('/create', upload.array('images'), async (req, res) => {
    try {
        console.log('Request Body:', req.body); // Log request body for debugging
        console.log('Uploaded Files:', req.files); // Log uploaded files for debugging

        const { name, color } = req.body;

        if (!name || !color) {
            return res.status(400).json({ success: false, error: 'Name and color are required' });
        }

        const imagesArr = [];
        for (let i = 0; i < req.files.length; i++) {
            const options = {
                use_filename: true,
                unique_filename: false,
                overwrite: false
            };

            const img = await cloudinary.uploader.upload(req.files[i].path, options);
            console.log('Cloudinary Upload Response:', img); // Log Cloudinary response
            imagesArr.push(img.secure_url);
            fs.unlinkSync(req.files[i].path); // Delete the uploaded file from the local uploads folder
        }

        console.log('Images Array:', imagesArr); // Log the images array before saving

        const category = new Category({ name, color, images: imagesArr });
        const savedCategory = await category.save();
        console.log('Saved Category:', savedCategory); // Log the saved category object

        res.status(201).json(savedCategory);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ success: false, error: 'Failed to create category' });
    }
});

// GET route to fetch all categories
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = 8;
        const totalPosts = await Category.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return res.status(404).json({ message: 'No data found!' });
        }

        const categoryList = await Category.find()
            .skip((page - 1) * perPage)
            .limit(perPage);

        res.status(200).json({
            categoryList,
            totalPages,
            page
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch categories' });
    }
});

// GET route to fetch a category by ID
router.get('/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, error: 'Invalid category ID' });
    }

    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        console.error('Error fetching category by ID:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch category' });
    }
});

// PUT route to update a category by ID
router.put('/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, error: 'Invalid category ID' });
    }

    try {
        const { name, images, color } = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { name, images, color },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(updatedCategory);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ success: false, error: 'Failed to update category' });
    }
});

// DELETE route to delete a category by ID
router.delete('/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, error: 'Invalid category ID' });
    }

    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ success: false, error: 'Failed to delete category' });
    }
});

module.exports = router;
