export default class DtoOrderRequest {
    
    customer
    order

    constructor(customer, items,total_value) {
        this.customer = customer
        this.order = {
            total_value: total_value,
            items: items
        }
    }
    

}   