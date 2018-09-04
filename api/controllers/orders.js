const mongoose = require('mongoose')
const Order = require('../models/order')
const Product = require('../models/product')
const URL = require('url') ;

exports.get_all_orders = (req, res, next) => {
    Order
        .find()
        .select('product quantity _id')
        .populate('product', 'name price')
        .exec()
        .then( docs => {
            const response = {
                count: docs.length,
                orders: docs.map( doc => {
                    return {
                        product: doc.product,
                        quantity: doc.quantity,
                        _id: doc._id,
                        request: {
                            desc: "List specific order",
                            type: 'GET',
                            url: "http://" + req.get('host') + "/orders/" + doc._id,
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
    Product.findById( req.body.product )
        .then( product => {
            if ( !product ) {
                return res.status(500).json({
                    message: 'Product not found in system',
                })
            }

            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                product: req.body.product,
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
                    product: result.product,
                    quantity: result.quantity,
                    request: {
                        desc: "List specific order",
                        type: 'GET',
                        url: "http://" + req.get('host') + "/orders/" + result._id
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

exports.get_order_byId = (req, res, next) => {
    Order.findById( req.params.orderId )
        .populate('product')
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
                    url: "http://" + req.get('host') + "/orders",
                }
            })
        })
        .catch( err => {
            res.status(500).json({
                error: err,
            })
        })
}

exports.patch_order_byId = (req, res, next) => {
    const id = req.params.orderId
    Order.findById( id )
        .populate('product')
        .exec()
        .then( order => {
            if ( !order ) {
                res.status(404).json({
                    message: 'OrderId not found in system',
                })
            }
            res.status(202).json({
                message: "Handle 'PATCH' order not implemented",
                request: {
                    desc: "Get orders by Id",
                    type: 'GET',
                    url: "http://" + req.get('host') + "/orders/" + id,
                }
            })
        })
        .catch( err => {
            res.status(500).json({
                error: err,
            })
        })
}

exports.delete_order_byId = (req, res, next) => {
    const id = req.params.orderId
    Order.remove({ _id: id })
        .exec()
        .then( result => {
            res.status(200).json({
                message: "Handle 'DELETE' request for order",
                request: {
                    desc: "Add new order",
                    type: 'POST',
                    url: "http://" + req.get('host') + "/orders",
                    body: {
                        product: 'ID',
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
}