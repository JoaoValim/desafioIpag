import OrderItems from "../model/orderItems.js";
import OrderItemsRepository from "../repositories/orderItemsRepository.js";

export default class OrderItemService {

    #orderItemsRepository

    constructor() {
        this.#orderItemsRepository = new OrderItemsRepository()
    }

    async getOrderItemsById(client, idOrder) {
        try {
            const itemRepository =  await this.#orderItemsRepository.getOrderItemsById(client, idOrder)

            if (itemRepository.length === 0)
                return []

            const list = []
            for(const row of itemRepository){
                const orderItems = new OrderItems(row.id, row.order_id, row.product_name, parseInt(row.quantity), parseFloat(row.unit_value))
                list.push(orderItems)
            }

            return list
        } catch (error) {
            console.log("Error in getOrderItemsById Service: "+error)
            throw error
        }

    }

    async createOrderItems(client, orderItem) {
        try {
            await this.#orderItemsRepository.createOrderItems(client, orderItem)
        } catch (error) {
            console.log("Error in createOrderItems Service: "+error)
            throw error
        }
    }

}