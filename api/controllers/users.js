const mongoose = require('mongoose')
const User = require('../models/user')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.signup = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Email exits"
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                        })
                        user
                            .save()
                            .then(result => {
                                console.log(result)
                                res.status(201).json({
                                    message: 'User created'
                                })
                            })
                            .catch(err => {
                                console.log(err)
                                res.status(500).json({
                                    error: err,
                                })
                            })
                    }
                })
            }
        })
}

exports.login = (req, res, next) => {
    User.find({ email: req.body.email })
      .exec()
        .then( user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth fail',
                })
            }
            bcrypt.compare( req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth fail',
                    })
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id,
                        }, 
                        process.env.JWT_SECRET_KEY,
                        {
                            expiresIn: "1hr",
                        })
                    
                    return res.status(200).json({
                        message: 'Auth success',
                        token: token,
                    })
                }
                res.status(401).json({
                    message: 'Auth fail',
                })
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err,
            })
        })
}

exports.get_all = (req, res, next) => {
    User
        .find()
        .select( "_id email role active" )
        .exec()
        .then( docs => {
            const response = {
                count: docs.length,
                users: docs.map( doc => {
                    return { user: doc }
                })
            }
            res.status(200).json( response )
        })
        .catch( err => {
            console.log(err)
            res.status(500).json({
                error: err,
            })
        })
}

exports.delete_byId = (req, res, next) => {
    User.remove({
        _id: req.params.userId
    })
        .exec()
        .then( result => {
            res.status(200).json({
                message: 'User deleted',
            })
        })
        .catch( err => {
            console.log(err)
            res.status(500).json({
                error: err,
            })
        })
}