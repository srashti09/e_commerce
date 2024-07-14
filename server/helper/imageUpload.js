const express = require('express');
const router = express.Router();
const { ImageUpload } = require('../models/imageUpload.js');

router.get('/', async (req, res) => {
    try {
        const imageUploadList = await ImageUpload.find();

        if (imageUploadList.length === 0) {
            return res.status(404).json({ success: false, message: 'No images found' });
        }

        return res.status(200).json(imageUploadList);
    } catch (error) {
        console.error('Error fetching image uploads:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

router.delete('/deleteAllImages', async (req, res) => {
    try {
        const images = await ImageUpload.find();

        if (images.length === 0) {
            return res.status(404).json({ success: false, message: 'No images to delete' });
        }

        const deletedImages = [];
        for (const image of images) {
            const deletedImage = await ImageUpload.findByIdAndDelete(image.id);
            deletedImages.push(deletedImage);
        }

        return res.status(200).json({ success: true, deletedImages });
    } catch (error) {
        console.error('Error deleting images:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;
