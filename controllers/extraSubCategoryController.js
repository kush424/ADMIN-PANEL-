const ExtraSubCategory = require('../models/extraSubCategoryModel');
const Category = require('../models/categoryModel');
const SubCategory = require('../models/subCategoryModel');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'public/images/'); },
    filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
});
const upload = multer({ storage });
exports.upload = upload;

exports.addExtraSubCategoryPage = async (req, res) => {
    const categories = await Category.find({ status: 'Active' });
    const subCategories = await SubCategory.find({ status: 'Active' });
    res.render('extraSubCategory/add-extraSubCategory', { user: req.user, categories, subCategories });
};

exports.addExtraSubCategory = async (req, res) => {
    const { name, category, subCategory, status } = req.body;
    const image = req.file ? req.file.filename : 'default.jpg';
    await ExtraSubCategory.create({ name, category, subCategory, status, image });
    req.flash('success', 'Extra Sub Category added!');
    res.redirect('/view-extraSubCategory');
};

exports.viewExtraSubCategoryPage = async (req, res) => {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};
    const total = await ExtraSubCategory.countDocuments(query);
    const extraSubCategories = await ExtraSubCategory.find(query)
        .populate('category')
        .populate('subCategory')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });
    res.render('extraSubCategory/view-extraSubCategory', { user: req.user, extraSubCategories, search, page, totalPages: Math.ceil(total / limit) });
};

exports.editExtraSubCategoryPage = async (req, res) => {
    const extraSubCategory = await ExtraSubCategory.findById(req.params.id);
    const categories = await Category.find({ status: 'Active' });
    const subCategories = await SubCategory.find({ status: 'Active' });
    res.render('extraSubCategory/edit-extraSubCategory', { user: req.user, extraSubCategory, categories, subCategories });
};

exports.editExtraSubCategory = async (req, res) => {
    const { name, category, subCategory, status } = req.body;
    const updateData = { name, category, subCategory, status };
    if (req.file) updateData.image = req.file.filename;
    await ExtraSubCategory.findByIdAndUpdate(req.params.id, updateData);
    req.flash('success', 'Extra Sub Category updated!');
    res.redirect('/view-extraSubCategory');
};

exports.deleteExtraSubCategory = async (req, res) => {
    await ExtraSubCategory.findByIdAndDelete(req.params.id);
    req.flash('success', 'Extra Sub Category deleted!');
    res.redirect('/view-extraSubCategory');
};

exports.toggleStatus = async (req, res) => {
    const extra = await ExtraSubCategory.findById(req.params.id);
    extra.status = extra.status === 'Active' ? 'Inactive' : 'Active';
    await extra.save();
    res.redirect('/view-extraSubCategory');
};  