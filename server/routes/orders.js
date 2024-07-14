const express = require('express');
const router = express.Router();
const Orders = require('../models/orders');

// GET all orders
router.get('/', async (req, res) => {
    try {
        const ordersList = await Orders.find(req.query);

        if (!ordersList) {
            return res.status(500).json({ success: false, error: 'Failed to fetch orders' });
        }

        return res.status(200).json(ordersList);
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// GET order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await Orders.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        return res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// GET count of orders
router.get('/get/count', async (req, res) => {
    try {
        const orderCount = await Orders.countDocuments();

        return res.status(200).json({ orderCount });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// POST create a new order
router.post('/create', async (req, res) => {
    try {
        const {
            name,
            phoneNumber,
            address,
            pincode,
            amount,
            paymentId,
            email,
            userid,
            products,
        } = req.body;

        const order = new Orders({
            name,
            phoneNumber,
            address,
            pincode,
            amount,
            paymentId,
            email,
            userid,
            products,
        });

        const savedOrder = await order.save();

        return res.status(201).json(savedOrder);
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Failed to create order' });
    }
});

// DELETE an order by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedOrder = await Orders.findByIdAndDelete(req.params.id);

        if (!deletedOrder) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        return res.status(200).json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Failed to delete order' });
    }
});

// PUT update an order by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedOrder = await Orders.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        return res.status(200).json(updatedOrder);
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Failed to update order' });
    }
});

module.exports = router;
