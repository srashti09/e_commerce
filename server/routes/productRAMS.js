const express = require('express');
const router = express.Router();
const { ProductRams } = require('../models/productRAMS');

// GET all products RAMS
router.get('/', async (req, res) => {
    try {
        const productRAMSList = await ProductRams.find();

        if (!productRAMSList || productRAMSList.length === 0) {
            return res.status(404).json({ success: false, message: 'No products RAMS found' });
        }

        return res.status(200).json(productRAMSList);
    } catch (error) {
        console.error('Error fetching product RAMS:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// GET single product RAM by ID
router.get('/:id', async (req, res) => {
    try {
        const productRAM = await ProductRams.findById(req.params.id);

        if (!productRAM) {
            return res.status(404).json({ success: false, message: 'Product RAM not found' });
        }

        return res.status(200).json(productRAM);
    } catch (error) {
        console.error('Error fetching product RAM by ID:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// POST create a new product RAM
router.post('/create', async (req, res) => {
    try {
        const { productRam } = req.body;

        if (!productRam) {
            return res.status(400).json({ success: false, error: 'Product RAM must be provided' });
        }

        const newProductRAM = new ProductRams({ productRam });
        const savedProductRAM = await newProductRAM.save();

        res.status(201).json(savedProductRAM);
    } catch (error) {
        console.error('Error creating product RAM:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// PUT update product RAM by ID
router.put('/:id', async (req, res) => {
    try {
        const { productRam } = req.body;

        const updatedProductRAM = await ProductRams.findByIdAndUpdate(
            req.params.id,
            { productRam },
            { new: true }
        );

        if (!updatedProductRAM) {
            return res.status(404).json({ success: false, message: 'Product RAM not found or could not be updated' });
        }

        res.status(200).json(updatedProductRAM);
    } catch (error) {
        console.error('Error updating product RAM:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// DELETE product RAM by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedProductRAM = await ProductRams.findByIdAndDelete(req.params.id);

        if (!deletedProductRAM) {
            return res.status(404).json({ success: false, message: 'Product RAM not found or could not be deleted' });
        }

        res.status(200).json({ success: true, message: 'Product RAM deleted successfully' });
    } catch (error) {
        console.error('Error deleting product RAM:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;
