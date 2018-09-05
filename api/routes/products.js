const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const authCheck = require('../auth/auth-check')
const upload = require('./upload')

const ProductController = require('../controllers/products')

router.get('/', authCheck,  ProductController.get_all_products)

router.post('/', authCheck, upload.single('productImage'), ProductController.create)

router.get('/:productId', authCheck, ProductController.get_product_byId)

router.patch('/:productId', authCheck, ProductController.patch_product_byId)

router.delete('/:productId', authCheck, ProductController.delete_product_byId)

module.exports = router