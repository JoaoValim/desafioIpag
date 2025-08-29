export default class Order{
    #id
    #customer_id
    #order_number
    #total_value
    #status
    #created_at
    #updated_at

    constructor(id, customer_id, order_number, total_value, status, created_at, updated_at){
        this.#id = id;
        this.#customer_id = customer_id;
        this.#order_number = order_number;
        this.#total_value = total_value;
        this.#status = status;
        this.#created_at = created_at;
        this.#updated_at = updated_at;
    }

    get id(){
        return this.#id;
    }

    get customer_id(){
        return this.#customer_id;
    }

    get order_number(){
        return this.#order_number;
    }

    get total_value(){
        return this.#total_value;
    }

    get status(){
        return this.#status;
    }

    get created_at(){
        return this.#created_at;
    }

    get updated_at(){
        return this.#updated_at;
    }

    set id(id){
        this.#id = id;
    }

    set customer_id(customer_id){
        this.#customer_id = customer_id;
    }

    set order_number(order_number){
        this.#order_number = order_number;
    }

    set total_value(total_value){
        this.#total_value = total_value;
    }

    set status(status){
        this.#status = status;
    }

    set created_at(created_at){
        this.#created_at = created_at;
    }

    set updated_at(updated_at){
        this.#updated_at = updated_at;
    }


    

    toJSON() {
        return {
            id: this.#id,
            customer_id: this.#customer_id,
            order_number: this.#order_number,
            total_value: this.#total_value,
            status: this.#status,
            created_at: this.#created_at,
            updated_at: this.#updated_at
        };
    }

}