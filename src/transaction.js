export class Transaction {
    constructor(type, amount) {
        if (typeof type != 'string') {
            throw new Error('Type of transaction needs to be deposit or withdraw')
        }
        this.type = type
        this.amount = amount
        this.time = new Date()
    }
}