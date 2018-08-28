const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Product = require('../models/product')

router.get('/', (req, res, next) => {
    Product.find()
        .exec()
        .then( docs => {
            res.status(200).json( docs )
            console.log( docs )
        })
        .catch( err => {
            console.log( err )
            res.status(500).json({ error: err })
        })
})

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.  Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
    })
    product.save().then( result => {
        console.log( result )
        res.status(201).json({
            message: "Handling POST requests to /Products",
            created: result
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
        .exec()
        .then(doc => {
            console.log( doc )
            if ( doc ) {
                res.status(200).json( doc )
            } else {
                res.status(404).json( 'No valid entry for id: ' + id )
            }
            
        })
        .catch( err => {
            console.log( err )
            res.status(500).json({error: err})
        })
})

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId
    const updateData = {}
    for ( const data of req.body ) {
        updateData[data.propName] = data.value
    }
    Product.update({ _id: id }, { $set: updateData } )
        .exec()
        .then( result => {
            console.log( result )
            res.status(200).json( result )
        })
        .catch( err => {
            console.log( err )
            res.status(500).json({
                error: err
            })
        })
})

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId
    Product.remove({ _id: id })
        .exec()
        .then( result => {
            res.status(200).json( result )
        })
        .catch( err => {
            console.log( err )
            res.status(500).json({ 
                error: err 
            })
        })
})

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Handling DELETE requests to delete order',
        orderId: req.paramms.orderId
    })
})

module.exports = router