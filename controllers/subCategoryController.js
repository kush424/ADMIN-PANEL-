const SubCategory = require('../models/subCategoryModel');
const Category = require('../models/categoryModel');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'public/images/'); },
    filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
});
const upload = multer({ storage });
exports.upload = upload;

exports.addSubCategoryPage = async (req, res) => {
    const categories = await Category.find({ status: 'Active' });
    res.render('subCategory/add-subCategory', { user: req.user, categories });
};

exports.addSubCategory = async (req, res) => {
    const { name, category, status } = req.body;
    const image = req.file ? req.file.filename : 'default.jpg';
    await SubCategory.create({ name, category, status, image });
    req.flash('success', 'Sub Category added!');
    res.redirect('/view-subCategory');
};

exports.viewSubCategoryPage = async (req, res) => {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};
    const total = await SubCategory.countDocuments(query);
    const subCategories = await SubCategory.find(query)
        .populate('category')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });
    res.render('subCategory/view-subCategory', { user: req.user, subCategories, search, page, totalPages: Math.ceil(total / limit) });
};

exports.editSubCategoryPage = async (req, res) => {
    const subCategory = await SubCategory.findById(req.params.id);
    const categories = await Category.find({ status: 'Active' });
    res.render('subCategory/edit-subCategory', { user: req.user, subCategory, categories });
};

exports.editSubCategory = async (req, res) => {
    const { name, category, status } = req.body;
    const updateData = { name, category, status };
    if (req.file) updateData.image = req.file.filename;
    await SubCategory.findByIdAndUpdate(req.params.id, updateData);
    req.flash('success', 'Sub Category updated!');
    res.redirect('/view-subCategory');
};

exports.deleteSubCategory = async (req, res) => {
    await SubCategory.findByIdAndDelete(req.params.id);
    req.flash('success', 'Sub Category deleted!');
    res.redirect('/view-subCategory');
};

exports.toggleStatus = async (req, res) => {
    const sub = await SubCategory.findById(req.params.id);
    sub.status = sub.status === 'Active' ? 'Inactive' : 'Active';
    await sub.save();
    res.redirect('/view-subCategory');
};