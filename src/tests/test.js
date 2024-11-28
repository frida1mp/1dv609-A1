import { Account } from "../account.js"
import { expect, jest } from '@jest/globals'
import { AccountManager } from '../accountManager.js'
import { Transaction } from "../transaction.js"

jest.mock("./src/transaction.js", () => {
  return {
    Transaction: jest.fn().mockImplementation((type, amount) => {
      return {
        type,
        amount,
        time: new Date(),
      }
    }),
  }
})

jest.mock("./src/accountManager.js", () => {
  return {
    AccountManager: jest.fn().mockImplementation((transactionClass) => {
      return {
        Transaction: transactionClass,
        logTransaction: jest.fn(),
      }
    }),
  }
})

describe('BookingManager', () => {
  let account
  let mockAccountManager

  beforeEach(() => {
    mockAccountManager = new AccountManager(Transaction)
    account = new Account(mockAccountManager)
  })


  test('should create an account with an initial balance of 0', () => {
    expect(account.getBalance()).toBe(0)
  })

  test('should deposit money into the current balance', () => {
    account.deposit(50)
    expect(account.getBalance()).toBe(50)
  })

  test('should throw exception when depositing string', () => {
    expect(() => account.deposit("50")).toThrow("Deposit amount must be a valid positive number.")
  })

  test('should log transaction message after depositing money', () => {
    account.deposit(40)
    expect(account.deposit(40)).toBe(`Deposited ${40}`)
  })

  test('should withdraw money from the current balance', () => {
    account.withdraw(40)
    expect(account.getBalance()).toBe(-40)
  })

  test('should throw exception when withdrawing string', () => {
    expect(() => account.withdraw("50")).toThrow("Withdrawing amount must be a valid positive number.")
  })

  test('should log transaction message after withdrawing money', () => {
    account.withdraw(40)
    expect(account.withdraw(40)).toBe(`Deposited ${-40}`)
  })

  test('should add new transaction with type, time and amount', () => {
    const transaction = new Transaction('deposit', 80)
    expect(transaction.type).toBe('deposit')
    expect(transaction.amount).toBe(80)
    expect(transaction.time).toBeInstanceOf(Date)
  })

  test('should throw exception when creating a transaction with invalid type', () => {
    expect(() => new Transaction(90, 80)).toThrow('Type of transaction needs to be deposit or withdraw')
  })

  test('should throw exception when creating a transaction with invalid amount', () => {
    expect(() => new Transaction('deposit', '80')).toThrow('Type of transaction needs to be a number')
  })

  test('should log transaction using an injected Transaction instance', () => {
    account.deposit(40)
    expect(mockAccountManager.logTransaction).toHaveBeenCalledWith("deposit", 40)
  })
})
