const Product = require('../models/productModel');
const multer = require('multer');
const path = require('path');
const deleteImages = require('../utils/deleteImgs'); // Corrected import

// Multer configuration for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/images'));
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
}).array('images', 5); // Limit to 5 images per product

// @desc    Add a new product
// @route   POST /api/products
// @access  Private
exports.addProduct = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ success: false, message: err });
        }

        try {
            const { sku, quantity, name, description, mainImage } = req.body;
            const images = req.files.map(file => file.path);

            const product = new Product({
                sku,
                quantity,
                name,
                description,
                images,
                mainImage
            });

            const createdProduct = await product.save();
            res.status(201).json({ success: true, product: createdProduct });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
    });
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Get a single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
exports.updateProduct = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ success: false, message: err });
        }

        try {
            const { sku, quantity, name, description, mainImage } = req.body;
            const images = req.files.map(file => file.path);

            const product = await Product.findById(req.params.id);

            if (!product) {
                // If product not found, delete uploaded images to avoid orphan files
                if (images.length > 0) deleteImages(images);
                return res.status(404).json({ success: false, message: 'Product not found' });
            }

            // Delete old images if new ones are provided
            if (images.length > 0) {
                deleteImages(product.images);
                product.images = images;
            }

            // Update product fields
            product.sku = sku || product.sku;
            product.quantity = quantity || product.quantity;
            product.name = name || product.name;
            product.description = description || product.description;
            if (mainImage) product.mainImage = mainImage;

            const updatedProduct = await product.save();
            res.json({ success: true, product: updatedProduct });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
    });
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Delete associated images from the server
        deleteImages(product.images);

        await product.deleteOne();
        res.json({ success: true, message: 'Product removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
