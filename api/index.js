import express from "express"
import orderRoutes from "./routes/ordersRoutes.js"

const app = express()

const port = 3000

app.use(express.json())

app.use("/orders",orderRoutes)


app.listen(port,()=>{
    console.log(`server rodando na porta: ${port}`);
})
