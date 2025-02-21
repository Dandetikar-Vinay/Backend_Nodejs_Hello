const express = require('express');
const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const secretKey = 'process.env.SECRET_KEY';
const dotenv = require('dotenv');
dotenv.config();

const verifyToken = async(req, res, next) => {
    const token = req.headers.token;
    if (!token) {
        return res.status(401).json({ error: 'Token is required' });
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        const vendor = await Vendor.findById(decoded.vendorId);
        if (!vendor) {
            return res.status(401).json({ error: 'Vendor not found' });
        }
        req.vendorId = decoded.vendorId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    };
};
module.exports = verifyToken;
