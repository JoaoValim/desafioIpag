import Order from '../model/order.js';

export default class OrderRepository {

    async createOrder(client, orderData) {
        try {
            let query = `INSERT INTO orders (customer_id, order_number, total_value, status)
                        VALUES ($1, $2, $3, $4) RETURNING id`
            let values = [orderData.customer_id, " ", orderData.total_value, "PENDING"]

            const { rows: result } = await client.query(query, values)

            // adiciona o order_number

            orderData.order_number = `ORD-${result[0].id.toString().padStart(6, '0')}`
            query = `UPDATE orders SET order_number = $1 WHERE id = $2`
            values = [orderData.order_number, result[0].id]

            await client.query(query, values)

            return result[0].id

        } catch (error) {
            console.error('Error creating order Repository:', error)
            throw error
        }
    }

    async getOrderById(client, orderId) {
        try {
            const query = `SELECT * FROM orders where id = $1`
            const values = [orderId]
            const { rows: result, rowCount: count } = await client.query(query, values)

            if (count === 0) {
                return null
            }

            return result[0]

        } catch (error) {
            console.error('Error getOrderById Repository:', error)
            throw error
        }
    }

    async getOrders(client) {
        try {

            const query = `SELECT * FROM orders`
            const { rows: result, rowCount: count } = await client.query(query)

            if (count === 0)
                return []
            return result

        } catch (error) {
            console.error('Error getOrders Repository:', error)
            throw error
        }
    }

    async updateStatus(client, dtoOrderStatusUpdate) {
        try {
            const query = `UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`
            const values = [dtoOrderStatusUpdate.status, dtoOrderStatusUpdate.orderId]
            await client.query(query, values)
        } catch (error) {
            console.error('Error updateStatus Repository:', error)
            throw error
        }
    }


    async getSummary(client) {
        try {
            // resumo por Status

            const queryByStatus = `
            SELECT 
                status, 
                COUNT(*) AS total_orders, 
                SUM(total_value) AS total_value,
                AVG(total_value) AS average_order_value
            FROM 
                orders 
            GROUP BY 
                status
            ORDER BY
                status;
        `;

            // totais Gerais
            const queryTotals = `
            SELECT
                COUNT(*) AS total_orders,
                SUM(total_value) AS total_value,
                AVG(total_value) AS average_order_value
            FROM
                orders;
        `;

            // resumo por Cliente
            const queryByCustomer = `
            SELECT 
                customers.id,
                customers.name,
                COALESCE(SUM(orders.total_value), 0.00) AS total_value, 
                COUNT(orders.id) AS total_orders
            FROM 
                customers 
            LEFT JOIN 
                orders ON customers.id = orders.customer_id 
            GROUP BY 
                customers.id, customers.name
            ORDER BY
                total_value DESC;
        `;

            // executa todas as queries
            const { rows: byStatus } = await client.query(queryByStatus);
            const { rows: totalsResult } = await client.query(queryTotals);
            const { rows: byCustomer } = await client.query(queryByCustomer);

            const generated_at = new Date().toISOString();


            return {
                generated_at,
                totals: totalsResult[0],
                by_status: byStatus,
                by_customer: byCustomer
            };

        } catch (error) {
            console.error('Error getOrderSummary Repository:', error);
            throw error;
        }
    }

}