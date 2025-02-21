const express = require('express');
const mongoose = require('mongoose');
const Firm = require('../models/Firm');
const verifyToken = require('../middleware/verifyToken');
const Vendor = require('../models/Vendor');
const multer = require('multer');
express.json();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });


const addFirm = async (req, res) => {
    try {

    const { firmName, area, category, region, offer} = req.body;
    const image = req.file? req.file.filename : undefined;
    if (!firmName || !area || !category || !region || !offer) {
        return res.status(400).json({ error: 'All fields are required' });
    }
        const vendor = await Vendor.findById(req.vendorId);
        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        const firm = new Firm({
            firmName,
            area,
            category,
            region,
            offer,
            image,
            vendor: req.vendorId,
        });
        const savedFirm =await firm.save();
        vendor.firm.push(savedFirm);
        await vendor.save();

        res.status(201).json({ message: 'Firm created successfully' });
        console.log('Firm created successfully');
    } catch (error) {
        res.status(500).json({ error: 'Failed to create firm' });
        console.log(error);
    }
};

const deleteFirmById = async (req, res) => {
    try {
        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);
        if (!firm) {
            return res.status(404).json({ error: 'Firm not found' });
        }
        await Firm.findByIdAndDelete(firmId);
        res.status(202).json({ message: 'Firm deleted successfully' });
    }
        catch (error) {
            res.status(500).json({ error: 'Failed to delete firm' });
        }
 };
        

        



module.exports = {
    addFirm:[upload.single('image'), addFirm],
    deleteFirmById,
    
};