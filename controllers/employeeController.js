const Employee = require('../models/employeeModel');
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

// Add Employee Page
exports.addEmployeePage = (req, res) => {
    res.render('add-employee', { user: req.user });
};

// Add Employee
exports.addEmployee = async (req, res) => {
    const { name, email, userId, phone, gender } = req.body;

    const existing = await Employee.findOne({ email });
    if (existing) {
        req.flash('error', 'Employee already exists!');
        return res.redirect('/add-employee');
    }

    const image = req.file ? req.file.filename : 'default.jpg';
    await Employee.create({ name, email, userId, phone, gender, image });

    req.flash('success', 'Employee added successfully!');
    res.redirect('/view-employee');
};

// View Employee Page
exports.viewEmployeePage = async (req, res) => {
    const employees = await Employee.find();
    res.render('view-employee', { user: req.user, employees });
};

// Edit Employee Page
exports.editEmployeePage = async (req, res) => {
    const employee = await Employee.findById(req.params.id);
    res.render('edit-employee', { user: req.user, employee });
};

// Edit Employee
exports.editEmployee = async (req, res) => {
    const { name, email, userId, phone, gender } = req.body;
    const updateData = { name, email, userId, phone, gender };
    if (req.file) updateData.image = req.file.filename;

    await Employee.findByIdAndUpdate(req.params.id, updateData);
    req.flash('success', 'Employee updated successfully!');
    res.redirect('/view-employee');
};

// Delete Employee
exports.deleteEmployee = async (req, res) => {
    await Employee.findByIdAndDelete(req.params.id);
    req.flash('success', 'Employee deleted successfully!');
    res.redirect('/view-employee');
};