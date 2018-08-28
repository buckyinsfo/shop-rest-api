const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

//const Product = require('./models/product')

const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')

mongoose.connect( 
    'mongodb://admin:' + 
    process.env.MONGO_ATLAS_PW + 
    '@shop-rest-api-shard-00-00-zs399.mongodb.net:27017,shop-rest-api-shard-00-01-zs399.mongodb.net:27017,shop-rest-api-shard-00-02-zs399.mongodb.net:27017/test?ssl=true&replicaSet=shop-rest-api-shard-0&authSource=admin&retryWrites=true',
    {
        useNewUrlParser: true,
    })

//mongoose.model('Product', productSchema)

console.log( process.env.MONGO_ATLAS_PW )

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use( (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')     
        return res.status(200).json({})
    }
    next()
})

app.use('/products', productRoutes)
app.use('/orders', orderRoutes)

app.use( (req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

app.use( (error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app