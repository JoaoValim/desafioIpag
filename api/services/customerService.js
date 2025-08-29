import Customer from "../model/customer.js";
import CustomerRepository from "../repositories/customerRepository.js";

export default class CustomerService {

    #CustomerRepository

    constructor() {
        this.#CustomerRepository = new CustomerRepository()
    }

    async getCustomerById(client, id) {
        try {
            const customerFromRepository = await this.#CustomerRepository.getCustomerById(client, id)

            if (!customerFromRepository)
                return null

            return new Customer(customerFromRepository.id, customerFromRepository.name, customerFromRepository.document, customerFromRepository.email, customerFromRepository.phone, customerFromRepository.created_at)

        } catch (error) {
            console.log("Error in getCustomerById Service: " + error)
            throw error
        }

    }

    async createCustomer(client, customer) {
        try {
            return await this.#CustomerRepository.createCustomer(client, customer)
        } catch (error) {
            throw error
        }
    }


}