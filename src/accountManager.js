export class AccountManager {
  constructor(transactionClass) {
      this.transaction = []
      this.transactionClass = transactionClass
  }

  async logTransaction(type, amount) {
      const transaction = await new this.transactionClass(type, amount)
      this.transaction.push(transaction)
      return `Deposited ${amount}`
  }

  getTransaction() {
      return this.transaction
  }
}