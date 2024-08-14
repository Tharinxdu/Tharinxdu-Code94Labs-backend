const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    sku: {
        type: String,
        required: true,
        unique: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    images: [{
        type: String,
        required: true,
    }],
    mainImage: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

// Create a text index for the fields you want to search
productSchema.index({ name: 'text', description: 'text', sku: 'text' });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
