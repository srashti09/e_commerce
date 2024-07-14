const { SubCategory } = require('../models/subCat');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 10; // Default perPage value

        const totalPosts = await SubCategory.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return res.status(404).json({ message: "No data found!" });
        }

        let subCategoryList = [];
        if (req.query.page !== undefined && req.query.perPage !== undefined) {
            subCategoryList = await SubCategory.find().populate("category")
                .skip((page - 1) * perPage)
                .limit(perPage);
        } else {
            subCategoryList = await SubCategory.find().populate("category");
        }

        if (!subCategoryList) {
            return res.status(500).json({ success: false });
        }

        return res.status(200).json({
            subCategoryList: subCategoryList,
            totalPages: totalPages,
            page: page
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/get/count', async (req, res) => {
    try {
        const subCatCount = await SubCategory.countDocuments();
        res.status(200).json({ subCatCount: subCatCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const subCat = await SubCategory.findById(req.params.id).populate("category");
        if (!subCat) {
            return res.status(404).json({ message: 'The sub category with the given ID was not found.' });
        }
        res.status(200).json(subCat);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/create', async (req, res) => {
    try {
        let subCat = new SubCategory({
            category: req.body.category,
            subCat: req.body.subCat
        });

        subCat = await subCat.save();
        res.status(201).json(subCat);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedSubCat = await SubCategory.findByIdAndDelete(req.params.id);
        if (!deletedSubCat) {
            return res.status(404).json({ message: 'Sub Category not found!', success: false });
        }
        res.status(200).json({ success: true, message: 'Sub Category Deleted!' });
    } catch (error) {
        console.error(error);
        res.status500().json({ success: false, error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const subCat = await SubCategory.findByIdAndUpdate(
            req.params.id,
            {
                category: req.body.category,
                subCat: req.body.subCat,
            },
            { new: true }
        );

        if (!subCat) {
            return res.status(404).json({ message: 'Sub Category cannot be updated!', success: false });
        }

        res.status(200).json(subCat);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
