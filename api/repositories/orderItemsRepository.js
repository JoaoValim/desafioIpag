
export default class OrderItemsRepository {


    async createOrderItems(client, orderItems) {
        try {
            const query = ` INSERT INTO order_items(order_id, product_name, quantity, unit_value)
                VALUES($1,$2,$3,$4)
            `
            const values = [orderItems.OrderId, orderItems.ProductName, orderItems.Quantity, orderItems.UnitValue]

            await client.query(query, values)

        } catch (error) {
            console.error("Error in createOrderItems: " + error)
            throw error
        }
    }

    async getOrderItemsById(client, idOrder) {
        try {

            const query = `SELECT * FROM order_items WHERE order_id = $1`
            const values = [idOrder]
            const { rows: result } = await client.query(query, values)

            if (result.length === 0)
                return []


            return result

        } catch (error) {
            console.error("Error in getOrderItemsById: " + error)
        }
    }

}