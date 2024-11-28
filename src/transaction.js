export class Transaction {
    constructor(type, amount) {
        this.type = type
        this.amount = amount
        this.time = new Date()
    }
}