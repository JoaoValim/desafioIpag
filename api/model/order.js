class order{
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

    get Id(){
        return this.#id;
    }

    get CustomerId(){
        return this.#customer_id;
    }

    get OrderNumber(){
        return this.#order_number;
    }

    get TotalValue(){
        return this.#total_value;
    }

    get Status(){
        return this.#status;
    }

    get CreatedAt(){
        return this.#created_at;
    }

    get UpdatedAt(){
        return this.#updated_at;
    }

    

}