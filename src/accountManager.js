export class AccountManager {
    constructor() {
        this.transaction = []
    }

    logTransaction(amount) {
        return `Deposited ${amount}`
    }

    getTransaction() {
        return this.transaction
    }
}