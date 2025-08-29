export default class DtoOrderItemRequest {
  
    product_name
    quantity
    unit_value

    constructor(product_name, quantity, unit_value) {
        this.product_name = product_name
        this.quantity = quantity
        this.unit_value = unit_value
    }

}