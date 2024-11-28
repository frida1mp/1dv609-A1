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
        if (typeof amount != "number" || amount < 0) {
            throw new Error("Deposit amount must be a valid positive number.")
        }
        this.#balance += amount
        return this.accountManager.logTransaction(amount)    
    }

    withdraw(amount) {
        if (typeof amount != "number" || amount < 0) {
            throw new Error("Withdrawing amount must be a valid positive number.")
        }
        this.#balance -= amount;
        return this.accountManager.logTransaction(-amount)
      }

} 