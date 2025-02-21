const express = require('express');
const mongoose = require('mongoose');
const Vendor = require('../models/Vendor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = 'process.env.SECRET_KEY';
const dotenv = require('dotenv');
dotenv.config();


const vendorLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const vendor = await Vendor.findOne({ email });
        if (!vendor) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isPasswordValid = await bcrypt.compare(password, vendor.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ vendorId: vendor._id }, secretKey, { expiresIn: '1h' });
        res.status(200).json( {"sucess":"Vendor Login Successfully" , token});
        console.log('Vendor Login Successfully');
        console.log(token);
    } catch (error) {
        res.status(500).json({ error: 'Failed to login' });
    }
};

const vendorRegister = async (req, res) => {
    const { username, email, password } = req.body;
    try {
    const vendorEmail = await Vendor.findOne({ email });
    if (vendorEmail) {
        return res.status(400).json({ error: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const vendor = new Vendor({
        username,
        email,
        password: hashedPassword,
    });
        await vendor.save();
        res.status(201).json({ message: 'Vendor registered successfully' });
        console.log('vendor registered successfully');
    } catch (error) {
        res.status(500).json({ error: 'Failed to register vendor' });
    }
};

const getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().populate('firm');
        res.status(200).json({vendors});
        console.log('All vendors fetched successfully');
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch vendors' });
    }
};

const getVendorById = async (req, res) => {
    const vendorId = req.params.id;
    try {
        const vendor = await Vendor.findById(vendorId).populate('firm');
        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }
        res.status(200).json(vendor);
        console.log('Vendor fetched successfully');
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch vendor' });
    }
};

module.exports = {
    vendorRegister,
    vendorLogin,
    getAllVendors,
    getVendorById,
};
