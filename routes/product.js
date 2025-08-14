const express = require('express')
const {authMiddleware} = require('../middleware/auth')
const {admin} = require('../middleware/adminOnly')
const router = express.Router();

const { createProduct, getAllProducts } = require('../controller/product');

router.get('/', authMiddleware, getAllProducts);
router.post('/', authMiddleware,admin,createProduct); // Add this to post new products

module.exports = router;
