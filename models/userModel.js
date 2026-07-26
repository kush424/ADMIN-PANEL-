const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, default: '' },
    mobile: { type: String, default: '' },
    gender: { type: String, default: '' },
    role: { type: String, enum: ['Super Admin', 'Admin', 'Manager', 'Employee'], default: 'Admin' },
    image: { type: String, default: 'default.jpg' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);