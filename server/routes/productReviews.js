const { ProductReviews } = require('../models/productReviews');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    let reviews = [];

    try {
        if (req.query.productId) {
            reviews = await ProductReviews.find({ productId: req.query.productId });
        } else {
            reviews = await ProductReviews.find();
        }

        if (reviews.length === 0) {
            return res.status(404).json({ success: false, message: 'No reviews found' });
        }

        return res.status(200).json(reviews);

    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.get('/get/count', async (req, res) => {
    try {
        const productsReviews = await ProductReviews.countDocuments();
        res.status(200).json({ success: true, productsReviews });
    } catch (error) {
        console.error('Error counting reviews:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const review = await ProductReviews.findById(req.params.id);
        
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        return res.status(200).json(review);
    } catch (error) {
        console.error('Error fetching review by ID:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.post('/add', async (req, res) => {
    try {
        const { customerId, customerName, review, customerRating, productId } = req.body;
        
        const newReview = new ProductReviews({
            customerId,
            customerName,
            review,
            customerRating,
            productId
        });

        const savedReview = await newReview.save();

        if (!savedReview) {
            return res.status(500).json({ success: false, message: 'Review could not be saved' });
        }

        res.status(201).json({ success: true, review: savedReview });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
