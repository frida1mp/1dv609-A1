export class Account {
    #balance

    constructor(accountManager) {
        this.#balance = 0
        this.accountManager = accountManager
    }

    getBalance() {
        return this.#balance
    }

    deposit(amount) {
        this.#balance += amount
        this.accountManager.logTransaction(`Deposit on ${amount} completed`)
    }
} 