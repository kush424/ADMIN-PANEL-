const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/project2');
        console.log('MongoDB Connected!');
    } catch (err) {
        console.error('MongoDB Error:', err);
        process.exit(1);
    }
};

module.exports = connectDB;