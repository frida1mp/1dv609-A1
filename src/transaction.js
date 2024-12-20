export class Transaction {
    constructor(type, amount) {
        if (typeof type != 'string') {
            throw new Error('Type of transaction needs to be deposit or withdraw')
        }

        if (typeof amount != 'number') {
            throw new Error('Type of transaction needs to be a number')
        }
        this.type = type
        this.amount = amount
        this.time = new Date()
    }
}