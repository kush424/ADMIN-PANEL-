const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const employeeController = require('../controllers/employeeController');
const categoryController = require('../controllers/categoryController');
const subCategoryController = require('../controllers/subCategoryController');
const extraSubCategoryController = require('../controllers/extraSubCategoryController');
const productController = require('../controllers/productController');
const isAuthenticated = require('../middleware/authMiddleware');

// Auth
router.get('/signup', authController.signupPage);
router.post('/signup', authController.signup);
router.get('/signin', authController.signinPage);
router.post('/signin', authController.signin);
router.get('/logout', authController.logout);

// Dashboard
router.get('/dashboard', isAuthenticated, authController.dashboard);

// Profile
router.get('/profile', isAuthenticated, authController.profilePage);
router.post('/profile', isAuthenticated, authController.updateProfile);
router.get('/change-password', isAuthenticated, authController.changePasswordPage);
router.post('/change-password', isAuthenticated, authController.changePassword);

// Forgot Password
router.get('/forgot-password', authController.getForgotPassword);
router.post('/forgot-password', authController.forgotPassword);
router.get('/verify-otp', authController.getVerifyOtp);
router.post('/verify-otp', authController.verifyOtp);
router.get('/reset-password', authController.getResetPassword);
router.post('/reset-password', authController.resetPassword);

// Employee
router.get('/add-employee', isAuthenticated, employeeController.addEmployeePage);
router.post('/add-employee', isAuthenticated, employeeController.upload.single('image'), employeeController.addEmployee);
router.get('/view-employee', isAuthenticated, employeeController.viewEmployeePage);
router.get('/edit-employee/:id', isAuthenticated, employeeController.editEmployeePage);
router.post('/edit-employee/:id', isAuthenticated, employeeController.upload.single('image'), employeeController.editEmployee);
router.post('/delete-employee/:id', isAuthenticated, employeeController.deleteEmployee);

// Category
router.get('/add-category', isAuthenticated, categoryController.addCategoryPage);
router.post('/add-category', isAuthenticated, categoryController.upload.single('image'), categoryController.addCategory);
router.get('/view-category', isAuthenticated, categoryController.viewCategoryPage);
router.get('/edit-category/:id', isAuthenticated, categoryController.editCategoryPage);
router.post('/edit-category/:id', isAuthenticated, categoryController.upload.single('image'), categoryController.editCategory);
router.post('/delete-category/:id', isAuthenticated, categoryController.deleteCategory);
router.get('/toggle-category/:id', isAuthenticated, categoryController.toggleStatus);

// SubCategory
router.get('/add-subCategory', isAuthenticated, subCategoryController.addSubCategoryPage);
router.post('/add-subCategory', isAuthenticated, subCategoryController.upload.single('image'), subCategoryController.addSubCategory);
router.get('/view-subCategory', isAuthenticated, subCategoryController.viewSubCategoryPage);
router.get('/edit-subCategory/:id', isAuthenticated, subCategoryController.editSubCategoryPage);
router.post('/edit-subCategory/:id', isAuthenticated, subCategoryController.upload.single('image'), subCategoryController.editSubCategory);
router.post('/delete-subCategory/:id', isAuthenticated, subCategoryController.deleteSubCategory);
router.get('/toggle-subCategory/:id', isAuthenticated, subCategoryController.toggleStatus);

// ExtraSubCategory
router.get('/add-extraSubCategory', isAuthenticated, extraSubCategoryController.addExtraSubCategoryPage);
router.post('/add-extraSubCategory', isAuthenticated, extraSubCategoryController.upload.single('image'), extraSubCategoryController.addExtraSubCategory);
router.get('/view-extraSubCategory', isAuthenticated, extraSubCategoryController.viewExtraSubCategoryPage);
router.get('/edit-extraSubCategory/:id', isAuthenticated, extraSubCategoryController.editExtraSubCategoryPage);
router.post('/edit-extraSubCategory/:id', isAuthenticated, extraSubCategoryController.upload.single('image'), extraSubCategoryController.editExtraSubCategory);
router.post('/delete-extraSubCategory/:id', isAuthenticated, extraSubCategoryController.deleteExtraSubCategory);
router.get('/toggle-extraSubCategory/:id', isAuthenticated, extraSubCategoryController.toggleStatus);

// Product
router.get('/add-product', isAuthenticated, productController.addProductPage);
router.post('/add-product', isAuthenticated, productController.upload.array('images', 5), productController.addProduct);
router.get('/view-product', isAuthenticated, productController.viewProductPage);
router.get('/edit-product/:id', isAuthenticated, productController.editProductPage);
router.post('/edit-product/:id', isAuthenticated, productController.upload.array('images', 5), productController.editProduct);
router.post('/delete-product/:id', isAuthenticated, productController.deleteProduct);
router.get('/toggle-product/:id', isAuthenticated, productController.toggleStatus);

module.exports = router;