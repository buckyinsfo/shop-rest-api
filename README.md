# Basic Shopping REST API
> This repository is a basic foundation for a shopping and commerce RERSTful API 

## Routers

### /user 
Signup and Login to receive an authorization token.

router.post('/signup', UserController.signup )

router.post('/login', UserController.login )

router.get('/', UserController.get_all )

router.delete('/:userId', UserController.delete_byId)


### /products 
List, create, patch and delete products.

router.get('/', authCheck,  ProductController.get_all_products)

router.post('/', authCheck, upload.single('productImage'), ProductController.create)

router.get('/:productId', authCheck, ProductController.get_product_byId)

router.patch('/:productId', authCheck, ProductController.patch_product_byId)

router.delete('/:productId', authCheck, ProductController.delete_product_byId)


### /orders
List, create, patch and delete products.

router.get('/', authCheck, OrderController.get_all_orders)

router.post('/', authCheck, OrderController.create)

router.get('/:orderId', authCheck, OrderController.get_order_byId)

router.patch('/:orderId', authCheck, OrderController.patch_order_byId)

router.delete('/:orderId', authCheck, OrderController.delete_order_byId)
