export default class DtoOrderStatusUpdate {
    orderId
    status
    notes

    constructor(orderId, status, notes) {
        this.orderId = orderId
        this.status = status
        this.notes = notes
    }
}