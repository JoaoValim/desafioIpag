import publishToQueue from "../../worker/publisher.js"
import pool from "../db/conexao.js"
import DtoResponseOrder from "../dto/dtoResponseOrder.js"
import CustomError from "../errors/CustomError.js"
import Order from "../model/order.js"
import OrderItems from "../model/orderItems.js"
import OrderRepository from "../repositories/orderRepository.js"
import { isValidStatusTransition } from "../utils/ordersUtils.js"
import CustomerService from "./customerService.js"
import OrderItemService from "./orderItemService.js"



export default class OrderService {

    #orderRepository

    constructor() {
        this.#orderRepository = new OrderRepository()
    }

    formatOrder(orderRepository) {
        return new Order(orderRepository.id, orderRepository.customer_id, orderRepository.order_number, orderRepository.total_value,
            orderRepository.status, orderRepository.created_at, orderRepository.updated_at)
    }


    async getAllOrder() {
        let client
        try {

            client = await pool.connect()

            const customerService = new CustomerService()
            const orderItemService = new OrderItemService()

            const listaOrdersRepository = await this.#orderRepository.getOrders(client)
            const ordersDto = []

            if (listaOrdersRepository.length === 0) {
                return []
            }

            // transforma a lista de orderRepository em lista de Order
            let listaOrders = []
            for (const row of listaOrdersRepository) {
                const order = new Order(row.id, row.customer_id, row.order_number, row.total_value,
                    row.status, row.created_at, row.updated_at)
                listaOrders.push(order)
            }

            
            for (let order of listaOrders) {
                const customer = await customerService.getCustomerById(client, order.customer_id)
                const orderItems = await orderItemService.getOrderItemsById(client, order.id)
                const dto = new DtoResponseOrder(order, customer, orderItems)
                ordersDto.push(dto)
            }

            return ordersDto

        } catch (error) {
            console.error("Error in getAllOrder Service: " + error)
            throw error
        } finally {
            if (client)
                client.release()
        }
    }

    async getOrderById(orderId) {

        let client
        try {

            client = await pool.connect()

            const customerService = new CustomerService()
            const orderItemService = new OrderItemService()

            const orderRepository = await this.#orderRepository.getOrderById(client, orderId)

            if (!orderRepository) {
                throw new CustomError("Pedido não encontrado", 404)
            }

            // cria o objeto order a partir do orderRepository

            const order = this.formatOrder(orderRepository)

            console.log("Order no service", order)
            const customer = await customerService.getCustomerById(client, order.customer_id)
            const orderItems = await orderItemService.getOrderItemsById(client, order.id)
            const dto = new DtoResponseOrder(order, customer, orderItems)


            return dto

        } catch (error) {
            console.error("Error in getOrderById Service: " + error)
            throw error
        } finally {
            if (client)
                client.release()
        }

    }

    async createOrder(dtoOrderRequest) {

        let client

        try {

            client = await pool.connect()
            client.query('BEGIN')

            const customerService = new CustomerService()
            const orderItemService = new OrderItemService()

            // verificar se o cliente existe
            const customer = await customerService.getCustomerById(client, dtoOrderRequest.customer.id)

            if (!customer) {
                throw new CustomError("Cliente não encontrado", 404)
            }

            // criar o pedido
            const order = new Order(null, dtoOrderRequest.customer.id, null, dtoOrderRequest.order.total_value, 'PENDING', null, null)

            const orderId = await this.#orderRepository.createOrder(client, order)

            // criar os itens do pedido
            for (let item of dtoOrderRequest.order.items) {
                const orderItem = new OrderItems(null, orderId, item.product_name, item.quantity, item.unit_value)
                await orderItemService.createOrderItems(client, orderItem)
            }

            await client.query('COMMIT')

        } catch (error) {

            if (client)
                await client.query('ROLLBACK')

            console.log("Error in createOrder Service: " + error)

            throw error

        } finally {
            if (client)
                client.release()
        }
    }

    async updateStatus(dtoOrderStatusUpdate) {
        let client
        try {
            console.log("dtoOrderStatusUpdate no service", JSON.stringify(dtoOrderStatusUpdate))
            // abrir conexao  
            client = await pool.connect()
            client.query('BEGIN')

            // verificar se o pedido existe
            const orderRepository = await this.#orderRepository.getOrderById(client, dtoOrderStatusUpdate.orderId)

            const order = await this.formatOrder(orderRepository)

            if (!order) {
                throw new CustomError("Pedido não encontrado", 404)
            }

            const currentStatus = order.status

            if (!isValidStatusTransition(currentStatus, dtoOrderStatusUpdate.status)) {
                throw new CustomError("Transição de status inválida", 400)
            }

            await this.#orderRepository.updateStatus(client, dtoOrderStatusUpdate)

            // enviar para queue do rabbitmq
            await publishToQueue(process.env.QUEUE_STATUS_ROUTING_KEY, {
                "order_id": order.order_number,
                "old_status": currentStatus,
                "new_status": dtoOrderStatusUpdate.status,
                "timestamp": new Date().toISOString(),
                "user_id": "system"
            })

            await client.query('COMMIT')

        } catch (error) {
            console.log("Error in updateStatus Service: " + error)
            throw error
        } finally {
            if (client)
                client.release()
        }

    }

    

    async getSummary() {
        let client
        try {
            client = await pool.connect()
            const summary = await this.#orderRepository.getSummary(client)
            
            // formatar a resposta para garantir que os tipos estão corretos
            const responseStatus = []
            summary.by_status.forEach(status => {
                responseStatus.push({
                    status: status.status,
                    totalOrders: parseInt(status.total_orders, 10),
                    totalValue: parseFloat(status.total_value),
                    averageOrderValue: parseFloat(status.average_order_value)
                })
            });

            const responseCustomers = []
            summary.by_customer.forEach(customer => {
                responseCustomers.push({
                    customerId: customer.id,
                    customerName: customer.name,
                    totalOrders: parseInt(customer.total_orders, 10),
                    totalValue: parseFloat(customer.total_value)
                })
            });

            const responseOrdersGeneral = {
                totalOrders: parseInt(summary.totals.total_orders, 10),
                totalValue: parseFloat(summary.totals.total_value),
                averageOrderValue: parseFloat(summary.totals.average_order_value)
            }

            return {
                "generated_at" : summary.generated_at,
                "totals": responseOrdersGeneral,
                "by_status": responseStatus,
                "by_customer": responseCustomers
            }
        } catch (error) {
            console.error("Error in getSummary Service: " + error)
            throw error
        } finally {
            if (client)
                client.release()
        }
    }

}