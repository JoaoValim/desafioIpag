export default class CustomError extends Error {
    name
    status
    constructor(message, status) {
        super(message);
        this.name = "CustomError";
        this.status = status || 500;
    }
}