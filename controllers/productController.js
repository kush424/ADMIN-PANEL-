const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const SubCategory = require('../models/subCategoryModel');
const ExtraSubCategory = require('../models/extraSubCategoryModel');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'public/images/'); },
    filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
});
const upload = multer({ storage });
exports.upload = upload;

exports.addProductPage = async (req, res) => {
    const categories = await Category.find({ status: 'Active' });
    const subCategories = await SubCategory.find({ status: 'Active' });
    const extraSubCategories = await ExtraSubCategory.find({ status: 'Active' });
    res.render('product/add-product', { user: req.user, categories, subCategories, extraSubCategories });
};

exports.addProduct = async (req, res) => {
    const { name, description, price, category, subCategory, extraSubCategory, status, stock } = req.body;
    const images = req.files ? req.files.map(f => f.filename) : [];
    await Product.create({ name, description, price, category, subCategory, extraSubCategory, status, stock, images });
    req.flash('success', 'Product added!');
    res.redirect('/view-product');
};

exports.viewProductPage = async (req, res) => {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
        .populate('category')
        .populate('subCategory')
        .populate('extraSubCategory')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });
    res.render('product/view-product', { user: req.user, products, search, page, totalPages: Math.ceil(total / limit) });
};

exports.editProductPage = async (req, res) => {
    const product = await Product.findById(req.params.id);
    const categories = await Category.find({ status: 'Active' });
    const subCategories = await SubCategory.find({ status: 'Active' });
    const extraSubCategories = await ExtraSubCategory.find({ status: 'Active' });
    res.render('product/edit-product', { user: req.user, product, categories, subCategories, extraSubCategories });
};

exports.editProduct = async (req, res) => {
    const { name, description, price, category, subCategory, extraSubCategory, status, stock } = req.body;
    const updateData = { name, description, price, category, subCategory, extraSubCategory, status, stock };
    if (req.files && req.files.length > 0) updateData.images = req.files.map(f => f.filename);
    await Product.findByIdAndUpdate(req.params.id, updateData);
    req.flash('success', 'Product updated!');
    res.redirect('/view-product');
};

exports.deleteProduct = async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    req.flash('success', 'Product deleted!');
    res.redirect('/view-product');
};

exports.toggleStatus = async (req, res) => {
    const product = await Product.findById(req.params.id);
    product.status = product.status === 'Active' ? 'Inactive' : 'Active';
    await product.save();
    res.redirect('/view-product');
};