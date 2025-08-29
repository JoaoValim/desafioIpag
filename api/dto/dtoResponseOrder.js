export default class DtoResponseOrder {
    #order


    constructor(order, customer, orderItems) {
        this.#order = {
            order_id: order.id,
            order_number: order.order_number,
            status: order.status,
            total_value: order.total_value,

            customer: {
                id: customer.Id,
                name: customer.Name,
                document: customer.Document,
                email: customer.Email,
                phone: customer.Phone
            },

            items: orderItems.map(item => ({
                product_name: item.ProductName,
                quantity: item.Quantity,
                unit_value: item.UnitValue,
                total_value: item.Quantity * item.UnitValue
            })),

            created_at: order.created_at
        }

    }

    get order() {
        return this.#order
    }

    toJSON() {
        return this.#order
    }


}