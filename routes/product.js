const express = require('express');
const router = express.Router();
const productController = require('../controller/product');
router.post('/add-product', productController.createProduct);
router.get('/show-product', productController.showProduct);
router.get('/get-product/:id', productController.getProduct);
router.delete('/delete-product/:id', productController.deleteProduct);
router.patch('/update-product/:id', productController.updateProduct)
exports.router = router;

