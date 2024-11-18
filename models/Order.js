const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    username: { type: String, required: true },
    mobile: { type: String, required: true },
    orders: { type: Object, required: true }, // Store day and food choices
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
