const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Submit an order
router.post('/', async (req, res) => {
    const { username, mobile, orders } = req.body;

    if (!username || !mobile || !orders) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const newOrder = new Order({ username, mobile, orders });
        await newOrder.save();
        res.status(201).json({ success: true, message: 'Order saved' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save order' });
    }
});

// Get all orders (for admin view)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve orders' });
    }
});

module.exports = router;
