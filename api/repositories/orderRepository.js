import Order from '../model/order.js';

export default class OrderRepository{

    async createOrder(client,orderData){

        try{
            const query = `INSERT INTO orders (customer_id, order_number, total_value, status, created_at, updated_at)
                        VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`
            const values = [orderData.customer_id, orderData.order_number, orderData.total_value, orderData.status, orderData.created_at, orderData.updated_at]
            
            const {rows:result} = await client.query(query,values)
            return result[0].id
        }catch(error){
            console.error('Error creating order:', error)
            throw error
        }
    }

    async getOrderById(client,orderId){
        try{
            const query = `SELECT * FROM orders where id = $1`
            const {rows:result} = client.query(query,orderId)

            const order = new Order(result[0].id, result[0].customer_id, result[0].order_number, result[0].total_value, 
                result[0].status, result[0].created_at, result[0].updated_at)
            
            return order
            
        }catch(error){
            throw error
        }
    }

    async getOrders(client){
        try{
            const query = `SELECT * FROM orders`
            const {rows:result,rowCount:count} = await client.query(query)
            let list = []
            for (const row of result){
                console.log(row)
                const order = new Order(row.id, row.customer_id, row.order_number, row.total_value, 
                    row.status, row.created_at, row.updated_at)
                list.push(order)
            }
            return list
            
        }catch(error){
            throw error
        }
    }


}