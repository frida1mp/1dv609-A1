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
        return this.accountManager.logTransaction(amount)    
    }

    withdraw(amount) {
        this.#balance -= amount;
        return this.accountManager.logTransaction(-amount)
      }

} 