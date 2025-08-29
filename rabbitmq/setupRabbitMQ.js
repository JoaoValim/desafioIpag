import amqp from 'amqplib';
import dotenv from 'dotenv';
dotenv.config();

export async function createConnection() {
    try {

        // envio as variaveis de ambiente para conectar no rabbitmq
        const connection = await amqp.connect(`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`)
        console.log('Connected to RabbitMQ');

        return connection;
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
        throw error;
    }
}

export async function setupRabbitMQ() {
    let connection
    try {
        connection = await createConnection();
        const channel = await connection.createChannel();

        // criar exchange
        await channel.assertExchange(process.env.EXCHANGE_NAME_STATUS, process.env.EXCHANGE_TYPE_STATUS, { durable: true });

        // criar fila
        await channel.assertQueue(process.env.QUEUE_STATUS, { durable: true });

        await channel.assertQueue(process.env.QUEUE_STATUS_DLQ, { durable:true, })


        // vincular a fila à exchange com uma routing key

        await channel.bindQueue(process.env.QUEUE_STATUS, process.env.EXCHANGE_NAME_STATUS, process.env.QUEUE_STATUS_ROUTING_KEY);

        await channel.bindQueue(process.env.QUEUE_STATUS_DLQ, process.env.EXCHANGE_NAME_STATUS, process.env.QUEUE_STATUS_DLQ_ROUTING_KEY);


        console.log('Channel created and Queue created')

    } catch (error) {
        console.error('Failed to create channel:', error);
        throw error;
    } finally {
        if (connection) {
                await connection.close()
            console.log('Connection in setupRabbitMQ closed')
        }
    }
}
