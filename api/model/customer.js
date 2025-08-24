class Customer{

    #id
    #name
    #document
    #email
    #phone
    #created_at

    constructor(id, name, document, email, phone, created_at){
        this.#id = id;
        this.#name = name;
        this.#document = document;
        this.#email = email;
        this.#phone = phone;
        this.#created_at = created_at;
    }

    get Id(){
        return this.#id;
    }

    get Name(){
        return this.#name;
    }

    get Document(){
        return this.#document;
    }

    get Email(){
        return this.#email;
    }

    get Phone(){
        return this.#phone;
    }

    get CreatedAt(){
        return this.#created_at;
    }

}