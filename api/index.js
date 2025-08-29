import express from "express"
import orderRoutes from "./routes/ordersRoutes.js"
import { setupRabbitMQ } from "../rabbitmq/setupRabbitMQ.js"
const app = express()

const port = 3000

app.use(express.json())

app.use("/orders",orderRoutes)


// garanto que a exchange e a fila existam
await setupRabbitMQ();

app.listen(port,()=>{
    console.log(`server rodando na porta: ${port}`);
})
