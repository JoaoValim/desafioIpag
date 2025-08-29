export default class CustomerRepository {

    async createCustomer(client, customer) {
        try {
            const query = `INSERT INTO customers(name, document, email, phone)
                VALUES($1,$2,$3,$4) RETURNING id
            `
            const values = [customer.Name, customer.Document, customer.Email, customer.Phone]
            const {rows:result} = await client.query(query, values)

            return result[0].id
        }catch(error){
            console.error("Error in create customer: "+error)
            throw error
        }
    }

    async getCustomerById(client,idCustomer){
        try{
            const query = `SELECT * FROM customers where id = $1`
            const values = [idCustomer]
            const {rows:result,rowCount:quantidade} = await client.query(query,values)

            // se não encontrar o cliente, retorna null
            
            if(quantidade===0) 
                return null

            return result[0]
        }catch(error){
            console.error("Error in getCustomerById Repository: "+error)
        }
    }
}