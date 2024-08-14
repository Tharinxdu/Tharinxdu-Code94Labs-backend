const Product = require('../models/productModel');
const multer = require('multer');
const path = require('path');
const deleteImages = require('../helpers/deleteImgs');

// Multer configuration for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/images'));
    },
    filename: function (req, file, cb) {
        cb(null, `${file.originalname}`);
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
            const { sku, quantity, name, description, price, mainImage } = req.body;
            const images = req.files.map(file => `/uploads/images/${file.filename}`);

            const product = new Product({
                sku,
                quantity,
                name,
                description,
                price,
                images,
                mainImage: `/uploads/images/${mainImage}`
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
            const { sku, quantity, name, description, price, mainImage } = req.body;
            let images = req.files.map(file => `/uploads/images/${file.filename}`);

            const product = await Product.findById(req.params.id);

            if (!product) {
                if (images.length > 0) deleteImages(images);
                return res.status(404).json({ success: false, message: 'Product not found' });
            }

            if (images.length > 0) {
                deleteImages(product.images);
                product.images = images;
            } else {
                // Keep existing images if no new images are uploaded
                images = product.images;
            }

            product.sku = sku || product.sku;
            product.quantity = quantity || product.quantity;
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;

            if (mainImage) {
                product.mainImage = mainImage.startsWith('/uploads/images/')
                    ? mainImage
                    : `/uploads/images/${mainImage}`;
            }

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

        deleteImages(product.images);

        await product.deleteOne();

        res.json({ success: true, message: 'Product removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
exports.searchProducts = async (req, res) => {
    const { query } = req.query;

    // Validate the query parameter
    if (!query || !query.trim()) {
        return res.status(400).json({ success: false, message: 'Query cannot be empty' });
    }

    try {
        // Search for products using MongoDB text search
        const products = await Product.find(
            { $text: { $search: query } }, 
            { score: { $meta: "textScore" } }
        ).sort({ score: { $meta: "textScore" } });

        // Check if any products were found
        if (products.length === 0) {
            return res.status(404).json({ success: true, message: 'No products found matching your search', products: [] });
        }

        // Return the found products
        res.json({ success: true, products });
    } catch (error) {
        // Handle potential server errors
        res.status(500).json({ success: false, message: 'Search error', error: error.message });
    }
};
