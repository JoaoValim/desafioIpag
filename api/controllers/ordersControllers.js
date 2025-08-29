import OrderService from "../services/orderService.js";
import CustomError from "../errors/CustomError.js";
import DtoCustomerRequest from "../dto/dtoCustomerRequest.js";
import DtoOrderRequest from "../dto/dtoOrderRequest.js";
import DtoOrderStatusUpdate from "../dto/dtoOrderStatusUpdate.js";

export default class OrdersController {



    // localhost:3000/orders
    async getOrders(req, res) {

        try {
            const orderService = new OrderService()
            const ordersDto = await orderService.getAllOrder()

            res.status(200).json(ordersDto)

        } catch (error) {
            console.error("Error in controller getOrders: " + error)
            res.status(500).json({
                "error": "erro no servidor"
            })
        }
    }

    // localhost:3000/orders/:id
    async getOrderById(req, res) {
        try {
            const idOrder = req.params.id

            const orderService = new OrderService()
            const orderDto = await orderService.getOrderById(idOrder)
            res.status(200).json(orderDto)


        } catch (error) {
            if (error instanceof CustomError) {
                res.status(error.status).json({
                    "error": error.message
                })

            }
            else {
                console.error("Error in controller getOrderById: " + error)
                res.status(500).json({
                    "error": "erro no servidor"
                })
            }
        }
    }

    // localhost:3000/orders
    async postOrders(req, res) {
        try {
            
            const body = req.body

            // verificar se o body está no formato correto
            if (!body || !body.customer || !body.customer.id || !body.customer.name || !body.customer.document
                || !body.customer.email || !body.customer.phone || !body.order || !body.order.total_value || !body.order.items
                || !Array.isArray(body.order.items) || body.order.items.length === 0
            ) {
                res.status(400).json({
                    "error": "Requisição inválida. Verifique o corpo da requisição."
                })
                return
            }



            const customer = body.customer
            const order = body.order
            const dtoCustomerRequest = new DtoCustomerRequest(customer.id, customer.name, customer.document, customer.email, customer.phone)
            const items = []

            order.items.forEach(item => {
                if (!item.product_name || !item.quantity || !item.unit_value) {
                    res.status(400).json({
                        "error": "Requisição inválida. Verifique o corpo da requisição."
                    })
                    return
                }
                items.push(item)
            });

            // se items.length for diferente de order.items.length, significa que houve um erro na validação dos itens
            if (items.length === order.items.length) {
                const dtoOrderRequest = new DtoOrderRequest(dtoCustomerRequest, items, order.total_value)

                // criar instancia de service
                const orderService = new OrderService()
                
                await orderService.createOrder(dtoOrderRequest)

                res.status(201).json({
                    "message": "Pedido criado com sucesso"
                })
            }


        } catch (error) {
            console.log("error", error)

            if (error instanceof CustomError) {
                res.status(error.status).json({
                    "error": error.message
                })

            }
            else {
                console.error("Error in controller postOrders: " + error.message)
                res.status(500).json({
                    "error": "erro no servidor"
                })
            }
        }
    }

    // localhost:3000/orders/:id/status
    async putOrders(req, res) {

        try {
            //busca o id do pedido na url
            const idOrder = req.params.id

            //busca o novo status e as notas no body da requisição
            const dtoBody = new DtoOrderStatusUpdate(idOrder, req.body.status, req.body.notes)

            // criar instancia de service
            const orderService = new OrderService()
            await orderService.updateStatus(dtoBody)


            res.status(200).json({
                "message": "Status atualizado com sucesso"
            })

        } catch (error) {
            if (error instanceof CustomError) {
                res.status(error.status).json({
                    "error": error.message
                })

            }
            else {
                console.error("Error in controller putOrders: " + error)
                res.status(500).json({
                    "error": "erro no servidor"
                })
            }
        }
    }

    async   getSummary(req, res) {
        try {
            const orderService = new OrderService()
            const summary = await orderService.getSummary()

            res.status(200).json(summary)

        } catch (error) {
            console.error("Error in controller getSummary: " + error)
            res.status(500).json({
                "error": "erro no servidor"
            })
        }
    }

}
