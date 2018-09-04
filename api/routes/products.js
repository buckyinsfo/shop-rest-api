const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const multer = require('multer')
const authCheck = require('../auth/auth-check')

const ProductController = require('../controllers/products')

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads/')
    },
    filename: (req, file, callback) => {
        callback(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
    },
    fileFilter: (req, file, callback) => {
        if ( file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            callback(null, true)
        } else {
            callback(null, false)
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 1024,
    },
})

const upload = multer({storage})

router.get('/', authCheck,  ProductController.get_all_products)

router.post('/', authCheck, upload.single('productImage'), ProductController.create)

router.get('/:productId', authCheck, ProductController.get_product_byId)

router.patch('/:productId', authCheck, ProductController.patch_product_byId)

router.delete('/:productId', authCheck, ProductController.delete_product_byId)

module.exports = router