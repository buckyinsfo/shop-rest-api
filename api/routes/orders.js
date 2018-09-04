const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const authCheck = require('../auth/auth-check')

const OrderController = require('../controllers/orders')

router.get('/', authCheck, OrderController.get_all_orders)

router.post('/', authCheck, OrderController.create)

router.get('/:orderId', authCheck, OrderController.get_order_byId)

router.patch('/:orderId', authCheck, OrderController.patch_order_byId)

router.delete('/:orderId', authCheck, OrderController.delete_order_byId)

module.exports = router