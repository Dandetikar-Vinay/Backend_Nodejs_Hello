const express = require('express');
const router = express.Router();
const firmController = require('../controllers/firmController');
const verifyToken = require('../middleware/verifyToken');

router.post('/addFirm', verifyToken, firmController.addFirm);


module.exports = router;