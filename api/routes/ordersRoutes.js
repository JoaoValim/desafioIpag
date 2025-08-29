import { Router } from "express";
import OrdersController from '../controllers/ordersControllers.js'
const router = Router() 
const controller = new OrdersController()

router.
get('/', controller.getOrders).
get('/summary',controller.getSummary).
get('/:id', controller.getOrderById).
post('/', controller.postOrders).
put('/:id/status', controller.putOrders)


export default router