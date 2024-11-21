export class Account {
    #balance

    constructor() {
        this.#balance = 0
    }

    getBalance() {
        return this.#balance
    }

    deposit(amount) {
        return 0
    }
} 