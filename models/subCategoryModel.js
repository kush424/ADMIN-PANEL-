const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    image: { type: String, default: 'default.jpg' }
}, { timestamps: true });

module.exports = mongoose.model('SubCategory', subCategorySchema);