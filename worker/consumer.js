import amqp from 'amqplib';
import dotenv from 'dotenv';
dotenv.config();

// createConnection tem a conexao com o rabbitmq
import { createConnection } from '../rabbitmq/setupRabbitMQ.js';
import NotificationLogRepository from '../api/repositories/notificationLogRepository.js';


async function startConsumer() {
    let connection;
    try {
        connection = await createConnection();
        const channel = await connection.createChannel();

        channel.prefetch(1); // processar uma mensagem por vez


        channel.consume(process.env.QUEUE_STATUS, async (msg) => {


            console.log("Mensagem recebida na fila 'order_status_updates':", msg.content.toString());


            // processamento da mensagem
            try {
                let objetoMsg = JSON.parse(msg.content);
                console.log("objetoMsg:", typeof objetoMsg, objetoMsg);

                // validar a mensagem
                if (typeof objetoMsg != "object" || !objetoMsg.order_id || !objetoMsg.new_status
                    || !objetoMsg.old_status || !objetoMsg.timestamp || !objetoMsg.user_id) {

                    console.error('Mensagem inválida:', msg.content.toString());

                    channel.publish(process.env.EXCHANGE_NAME_STATUS, "status.error", msg.content, { persistent: true });
                }
                // mensagem válida
                else {

                    console.log('Processando atualização de status para o pedido:', objetoMsg.order_id, 'Novo status:', objetoMsg.new_status);

                    // enviar mensagem para banco

                    const logRepository = new NotificationLogRepository();

                    
                    const logData = {
                        order_id: objetoMsg.order_id,
                        old_status: objetoMsg.old_status,
                        new_status: objetoMsg.new_status,
                        message: `Status do pedido ${objetoMsg.order_id} alterado para ${objetoMsg.new_status}` // Exemplo de mensagem
                    };
                    
                    await logRepository.saveLog(logData);
                }

            } catch (error) {
                console.error("Erro ao processar a mensagem:", error);
                channel.publish(process.env.EXCHANGE_NAME_STATUS, "status.error", msg.content, { persistent: true });

            }
            // finaliza e devolve um ack de recebimento para o rabbitmq
            finally {
                if (msg)    
                    channel.ack(msg); 
            }
            
        }, { noAck: false });

    } catch (error) {
        console.error('Error in consumer:', error);
    }

}

startConsumer();