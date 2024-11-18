const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    username: { type: String, required: true },  // Name of the user who placed the order
    mobile: { type: String, required: true },    // Mobile number of the user
    orderDate: { type: Date, default: Date.now }, // Date and time the order was placed
    orders: { 
        type: Map,
        of: String,
        required: true  // Map with keys representing the day, and values being the food choice
    },
    status: { 
        type: String, 
        enum: ['pending', 'completed', 'cancelled'], 
        default: 'pending'  // Order status
    }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
