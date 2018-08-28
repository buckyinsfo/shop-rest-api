const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to  /orders'
    })
})

router.post('/', (req, res, next) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity,
        price: req.body.price,
    }
    res.status(201).json({
        message: 'Handling POST requests to  /orders',
        order: order,
    })
})

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId
    if (id === 'special') {
        res.status(200).json({
            message: 'You discovered the special ID',
            orderId: id,
        })
    } else {
        res.status(200).json({
            message: 'You passed an orderID',
            orderId: id,
        })
    }
})

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Handling DELETE requests to delete order',
        orderId: req.params.orderId,
    })
})


module.exports = router