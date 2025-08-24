class Order_items{
    #id
    #order_id
    #product_name
    #quantity
    #unit_value

    constructor(id, order_id, product_name, quantity, unit_value){
        this.#id = id;
        this.#order_id = order_id;
        this.#product_name = product_name;
        this.#quantity = quantity;
        this.#unit_value = unit_value;
    }

    get Id(){
        return this.#id;
    }

    get OrderId(){
        return this.#order_id;
    }

    get ProductName(){
        return this.#product_name;
    }

    get Quantity(){
        return this.#quantity;
    }

    get UnitValue(){
        return this.#unit_value;
    }

}