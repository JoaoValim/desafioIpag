import { createConnection } from "../rabbitmq/setupRabbitMQ.js";
import dotenv from "dotenv"
dotenv.config()

export default async function publishToQueue(routingKey, message) {

    let connection
    let channel
    
    try {
        connection = await createConnection()
        channel = await connection.createConfirmChannel();

        channel.publish(process.env.EXCHANGE_NAME_STATUS, routingKey, Buffer.from(JSON.stringify(message)), { persistent: true });

        console.log(`Message:`, message);

        await channel.waitForConfirms()

    } catch (error) {
        console.error("Failed to create connection in Publisher: " + error)
        throw error
    } finally {
        if (channel)
            await channel.close()
        if (connection)
            await connection.close()
    }

}