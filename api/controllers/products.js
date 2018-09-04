const mongoose = require('mongoose')
const Product = require('../models/product')

exports.get_all_products = (req, res, next) => {
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
                            url: "http://" + req.get('host') + "/products/" + doc._id,
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
}

exports.create = (req, res, next) => {
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
                        url: "http://" + req.get('host') + "/products/" + result._id,
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
}

exports.get_product_byId = (req, res, next) => {
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
                        url: "http://" + req.get('host') + "/products",
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
}

exports.patch_product_byId = (req, res, next) => {
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
                    url: "http://" + req.get('host') + "/products/" + result._id,
                }
            })
        })
        .catch( err => {
            console.log( err )
            res.status(500).json({
                error: err
            })
        })
}

exports.delete_product_byId = (req, res, next) => {
    const id = req.params.productId
    Product.remove({ _id: id })
        .exec()
        .then( result => {
            res.status(200).json({
                message: "Handle 'DELETE' request for product",
                request: {
                    desc: "Add new product",
                    type: 'POST',
                    url: "http://" + req.get('host') + "/products",
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
}