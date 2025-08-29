import CustomerRepository from "./api/repositories/customerRepository.js";
import pool from "./api/db/conexao.js";
import Customer from "./api/model/customer.js";

async function test() {
    let client
    try {
        console.log("Starting test")
        client = await pool.connect()
        console.log("Connected to database")
        client.query('BEGIN')
        const customerRepository = new CustomerRepository()
        const customer = new Customer(null,"Joao Vitor", "123578900", "tste@gmail.com", "11999999999")
        const id = await customerRepository.createCustomer(client, customer)
        console.log("Customer created with id: " + id)
        client.query('COMMIT')

    } catch (error) {
        console.log("Error in test: " + error)
        throw error
    }finally{
        client.release()
    }
}

test()