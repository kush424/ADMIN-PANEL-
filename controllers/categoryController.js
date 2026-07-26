const Category = require('../models/categoryModel');
const multer = require('multer');
const path = require('path');

// Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
exports.upload = upload;

// Add Category Page
exports.addCategoryPage = async (req, res) => {
    res.render('category/add-category', { user: req.user });
};

// Add Category
exports.addCategory = async (req, res) => {
    const { name, status } = req.body;

    const existing = await Category.findOne({ name });
    if (existing) {
        req.flash('error', 'Category already exists!');
        return res.redirect('/add-category');
    }

    const image = req.file ? req.file.filename : 'default.jpg';
    await Category.create({ name, status, image });

    req.flash('success', 'Category added successfully!');
    res.redirect('/view-category');
};

// View Category Page
exports.viewCategoryPage = async (req, res) => {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    const query = search ? { name: { $regex: search, $options: 'i' } } : {};
    const total = await Category.countDocuments(query);
    const categories = await Category.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

    res.render('category/view-category', {
        user: req.user,
        categories,
        search,
        page,
        totalPages: Math.ceil(total / limit)
    });
};

// Edit Category Page
exports.editCategoryPage = async (req, res) => {
    const category = await Category.findById(req.params.id);
    res.render('category/edit-category', { user: req.user, category });
};

// Edit Category
exports.editCategory = async (req, res) => {
    const { name, status } = req.body;
    const updateData = { name, status };
    if (req.file) updateData.image = req.file.filename;

    await Category.findByIdAndUpdate(req.params.id, updateData);
    req.flash('success', 'Category updated successfully!');
    res.redirect('/view-category');
};

// Delete Category
exports.deleteCategory = async (req, res) => {
    await Category.findByIdAndDelete(req.params.id);
    req.flash('success', 'Category deleted successfully!');
    res.redirect('/view-category');
};

// Toggle Status
exports.toggleStatus = async (req, res) => {
    const category = await Category.findById(req.params.id);
    category.status = category.status === 'Active' ? 'Inactive' : 'Active';
    await category.save();
    req.flash('success', 'Status updated!');
    res.redirect('/view-category');
};