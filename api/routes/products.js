const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const multer = require('multer')
const checkAuth = require('../auth/check-auth')

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
const Product = require('../models/product')

router.get('/', (req, res, next) => {
    Product
        .find()
        .select( "name price _id productImage" )
        .exec()
        .then( docs => {
            const response = {
                count: docs.length,
                products: docs.map( doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        request: {
                            desc: "List specific product",
                            type: 'GET',
                            url: "http://localhost:3001/products/" + doc._id,
                        }
                    }
                })    
            }
            res.status(200).json( response )
        })
        .catch( err => {
            console.log( err )
            res.status(500).json({ 
                error: err 
            })
        })
})

router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {
    console.log(req.file)
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path,
    })
    
    product
        .save()
        .then( result => {
            console.log( result )
            res.status(201).json({
                message: "Handle POST requests to /products",
                createdProduct: {
                    _id: result._id,
                    name: result.name,
                    price: result.price,
                    productImage: result.productImage,
                    request: {
                        desc: "List specific product",
                        type: "GET",
                        url: "http://localhost:3001/products/" + result._id,
                    }
                }
            })
        })
        .catch( err => {
            console.log( err )
            res.status(500).json({
                error: err,
            })
        })
})

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId
    Product.findById(id)
        .select('_id name price productImage')
        .exec()
        .then(doc => {
            console.log( doc )
            if ( doc ) {
                res.status(200).json({
                    product: doc,
                    request: {
                        desc: "List all products",
                        type: "GET",
                        url: "http://localhost:3001/products",
                    }
                })
            } else {
                res.status(404).json( 'No valid entry for id: ' + id )
            }
            
        })
        .catch( err => {
            console.log( err )
            res.status(500).json({error: err})
        })
})

router.patch('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId
    const updateData = {}
    for ( const data of req.body ) {
        updateData[data.propName] = data.value
    }
    Product.update({ _id: id }, { $set: updateData } )
        .exec()
        .then( result => {
            res.status(200).json({
                message: "Handle 'PATCH' request for updating product",
                request: {
                    type: "GET",
                    url: "http://l0ocalhost:3001/products/" + result._id,
                }
            })
        })
        .catch( err => {
            console.log( err )
            res.status(500).json({
                error: err
            })
        })
})

router.delete('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId
    Product.remove({ _id: id })
        .exec()
        .then( result => {
            res.status(200).json({
                message: "Handle 'DELETE' request for product",
                request: {
                    desc: "Add new product",
                    type: 'POST',
                    url: "http://localhost:3001/",
                    body: {
                        name: 'Product Name',
                        price: 'Number',
                    }
                }
            })
        })
        .catch( err => {
            console.log( err )
            res.status(500).json({ 
                error: err 
            })
        })
})

module.exports = router