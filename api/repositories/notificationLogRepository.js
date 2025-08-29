import pool from '../db/conexao.js';

export default class NotificationLogRepository {
    
    async saveLog(logData) {
        // extrai os dados do log
        const { order_id: originalOrderId, old_status, new_status, message } = logData;

        // extrai e converte o ID do pedido
        // "ORD-000001" se torna o número 1
        const numericOrderId = parseInt(originalOrderId.split('-')[1], 10);

        const query = `
            INSERT INTO notification_logs (order_id, old_status, new_status, message)
            VALUES ($1, $2, $3, $4)
            RETURNING id;
        `;
        let client;
        try {
            client = await pool.connect();
            
            const result = await client.query(query, [numericOrderId, old_status, new_status, message]);
            console.log(`Log de notificação salvo com o ID: ${result.rows[0].id}`);
            return result.rows[0];
        } catch (error) {
            console.error('Erro ao salvar o log de notificação no banco de dados:', error);
            throw new Error('Falha ao salvar log no banco de dados.');
        } finally {
            if (client) 
                client.release();
        }
    }
}