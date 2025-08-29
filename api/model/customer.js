export default class Customer {

    #id
    #name
    #document
    #email
    #phone
    #created_at

    constructor(id, name, document, email, phone, created_at) {
        this.#id = id;
        this.#name = name;
        this.#document = document;
        this.#email = email;
        this.#phone = phone;
        this.#created_at = created_at;
    }

    get Id() {
        return this.#id;
    }

    get Name() {
        return this.#name;
    }

    get Document() {
        return this.#document;
    }

    get Email() {
        return this.#email;
    }

    get Phone() {
        return this.#phone;
    }

    get CreatedAt() {
        return this.#created_at;
    }

    set Id(id) {
        this.#id = id;
    }

    set Name(name) {
        this.#name = name;
    }

    set Document(document) {
        this.#document = document;
    }

    set Email(email) {
        this.#email = email;
    }

    set Phone(phone) {
        this.#phone = phone;
    }

    set CreatedAt(created_at) {
        this.#created_at = created_at;
    }

    toJSON() {
        return {
            id: this.#id,
            name: this.#name,
            document: this.#document,
            email: this.#email,
            phone: this.#phone,
            created_at: this.#created_at
        };
    }

}