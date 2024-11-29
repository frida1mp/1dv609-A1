export class Account {
    #balance

    constructor(accountManager) {
        this.#balance = 0
        this.accountManager = accountManager
    }

    getBalance() {
        return this.#balance
    }

    async deposit(amount) {
        if (typeof amount != "number" || amount < 0) {
            throw new Error("Deposit amount must be a valid positive number.")
        }
        this.#balance += amount
        const log = await this.accountManager.logTransaction('deposit', amount) 
        console.log('logging', log)
        return log
    }

    async withdraw(amount) {
        if (typeof amount != "number" || amount < 0) {
            console.log('withd', amount)
            throw new Error("Withdrawing amount must be a valid positive number.")
        }
        this.#balance -= amount;
        const log = await this.accountManager.logTransaction('withdraw', -amount)
        return log
      }

} 