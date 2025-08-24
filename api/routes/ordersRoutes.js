import { Router } from "express";
import { getOrders, postOrders } from "../controllers/ordersControllers.js";

const router = Router()

router.
get('/', getOrders).
post('/', postOrders)


export default router