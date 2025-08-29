export default class OrderItems {
    #id
    #order_id
    #product_name
    #quantity
    #unit_value

    constructor(id, order_id, product_name, quantity, unit_value) {
        this.#id = id;
        this.#order_id = order_id;
        this.#product_name = product_name;
        this.#quantity = quantity;
        this.#unit_value = unit_value;
    }

    get Id() {
        return this.#id;
    }

    get OrderId() {
        return this.#order_id;
    }

    get ProductName() {
        return this.#product_name;
    }

    get Quantity() {
        return this.#quantity;
    }

    get UnitValue() {
        return this.#unit_value;
    }

    set Id(id) {
        this.#id = id;
    }

    set OrderId(order_id) {
        this.#order_id = order_id;
    }

    set ProductName(product_name) {
        this.#product_name = product_name;
    }

    set Quantity(quantity) {
        this.#quantity = quantity;
    }

    set UnitValue(unit_value) {
        this.#unit_value = unit_value;
    }




    toJSON() {
        return {
            id: this.#id,
            order_id: this.#order_id,
            product_name: this.#product_name,
            quantity: this.#quantity,
            unit_value: this.#unit_value
        };
    }

}