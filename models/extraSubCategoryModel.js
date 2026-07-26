const mongoose = require('mongoose');

const extraSubCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory', required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    image: { type: String, default: 'default.jpg' }
}, { timestamps: true });

module.exports = mongoose.model('ExtraSubCategory', extraSubCategorySchema);