const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },
    extraSubCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'ExtraSubCategory' },
    images: [{ type: String }],
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    stock: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);