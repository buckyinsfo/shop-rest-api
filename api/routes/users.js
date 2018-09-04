const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const UserController = require('../controllers/users')

router.get('/', UserController.get_all )

router.post('/login', UserController.login )

router.post('/signup', UserController.signup )

router.delete('/:userId', UserController.delete_byId)

module.exports = router