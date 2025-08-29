export default class DtoCustomerRequest {
    
    id
    name
    document
    email
    phone

    constructor(id, name, document, email, phone) {
        this.id = id
        this.name = name
        this.document = document
        this.email = email
        this.phone = phone
    }

}