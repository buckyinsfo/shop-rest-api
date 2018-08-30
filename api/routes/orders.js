const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Order = require('../models/order')
const Product = require('../models/product')

router.get('/', (req, res, next) => {
    Order
        .find()
        .select('productId quantity _id')
        .exec()
        .then( docs => {
            const response = {
                count: docs.length,
                orders: docs.map( doc => {
                    return {
                        productId: doc.productId,
                        quantity: doc.quantity,
                        _id: doc._id,
                        request: {
                            desc: "List specific order",
                            type: 'GET',
                            url: "http://localhost:3001/orders/" + doc._id,
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

router.post('/', (req, res, next) => {
    Product.findById( req.body.productId )
        .then( product => {
            if ( !product ) {
                return res.status(500).json({
                    message: 'ProductId not found in system',
                })
            }

            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                productId: req.body.productId,
                quantity: req.body.quantity,
            })
            return order.save()
        })
        .then( result => {
            console.log( result )
            res.status(201).json({
                message: 'Handle POST requests to /orders',
                createdOrder: {
                    _id: result._id,
                    productId: result.productId,
                    quantity: result.quantity,
                    request: {
                        desc: "List specific order",
                        type: 'GET',
                        url: 'http://localhost:3001/orders/' + result._id
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

router.get('/:orderId', (req, res, next) => {
    Order.findById( req.params.orderId )
        .exec()
        .then( order => {
            if ( !order ) {
                res.status(404).json({
                    message: 'OrderId not found in system',
                })
            }
            res.status(200).json({
                order: order,
                request: {
                    desc: "List all orders",
                    type: 'GET',
                    url: "http://localhost:3001/orders",
                }
            })
        })
        .catch( err => {
            res.status(500).json({
                error: err,
            })
        })
})

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId
    Order.remove({ _id: id })
        .exec()
        .then( result => {
            res.status(200).json({
                message: "Handle 'DELETE' request for order",
                request: {
                    desc: "Add new order",
                    type: 'POST',
                    url: "http://localhost:3001/",
                    body: {
                        productId: 'ID',
                        quantity: 'Number',
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