const { Cart } = require('../models/cart');
const express = require('express');
const router = express.Router();

// Get all cart items
router.get(`/`, async (req, res) => {
    try {
        const cartList = await Cart.find(req.query);
        if (!cartList) {
            return res.status(500).json({ success: false, message: "Failed to fetch cart list" });
        }
        return res.status(200).json(cartList);
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

// Add a new cart item
router.post('/add', async (req, res) => {
    try {
        const { productTitle, image, rating, price, quantity, subTotal, productId, userId, countInStock } = req.body;

        const existingCartItem = await Cart.findOne({ productId, userId });
        if (existingCartItem) {
            return res.status(401).json({ success: false, message: "Product already added in the cart" });
        }

        const cartItem = new Cart({
            productTitle,
            image,
            rating,
            price,
            quantity,
            subTotal,
            productId,
            userId,
            countInStock
        });

        const savedCartItem = await cartItem.save();
        return res.status(201).json(savedCartItem);
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

// Delete a cart item by id
router.delete('/:id', async (req, res) => {
    try {
        const deletedItem = await Cart.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ success: false, message: 'Cart item not found!' });
        }
        return res.status(200).json({ success: true, message: 'Cart Item Deleted!' });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

// Get a cart item by id
router.get('/:id', async (req, res) => {
    try {
        const cartItem = await Cart.findById(req.params.id);
        if (!cartItem) {
            return res.status(404).json({ success: false, message: 'The cart item with the given ID was not found.' });
        }
        return res.status(200).json(cartItem);
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

// Update a cart item by id
router.put('/:id', async (req, res) => {
    try {
        const { productTitle, image, rating, price, quantity, subTotal, productId, userId } = req.body;

        const updatedCartItem = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                productTitle,
                image,
                rating,
                price,
                quantity,
                subTotal,
                productId,
                userId
            },
            { new: true }
        );

        if (!updatedCartItem) {
            return res.status(500).json({ success: false, message: 'Cart item cannot be updated!' });
        }
        return res.status(200).json(updatedCartItem);
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
