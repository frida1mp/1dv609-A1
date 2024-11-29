import { Account } from '../account.js'
import { expect, jest } from '@jest/globals'
import { AccountManager } from '../accountManager.js'
import { Transaction } from '../transaction.js'
import { showMenu, rl } from '../ui.js'

jest.mock('./src/transaction.js', () => {
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

jest.mock('./src/accountManager.js', () => {
  return {
    AccountManager: jest.fn().mockImplementation(() => {
      return {
        logTransaction: jest.fn(),
      }
    }),
  }
})

describe('BookingManager', () => {
  let account
  let mockAccountManager
  let logSpy

  beforeEach(() => {
    mockAccountManager = new AccountManager(Transaction)
    account = new Account(mockAccountManager)

    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
    rl.close()
  })


  test('should create an account with an initial balance of 0', () => {
    expect(account.getBalance()).toBe(0)
  })

  test('should deposit money into the current balance', () => {
    account.deposit(50)
    expect(account.getBalance()).toBe(50)
  })

  test('should throw exception when depositing string', () => {
    expect(() => account.deposit('50')).rejects.toThrow('Deposit amount must be a valid positive number.')
  })

  test('should log transaction message after depositing money', async () => {
    const result = await account.deposit(40)
    expect(result).toBe(`Deposited ${40}`)
  })

  test('should withdraw money from the current balance', () => {
    account.withdraw(40)
    expect(account.getBalance()).toBe(-40)
  })

  test('should throw exception when withdrawing string', () => {
    expect(() => account.withdraw('50')).rejects.toThrow('Withdrawing amount must be a valid positive number.')
  })

  test('should log transaction message after withdrawing money', async () => {
    const result = await account.withdraw(40)
    expect(result).toBe(`Deposited ${-40}`)
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

  test('should log transaction using an injected Transaction instance', async () => {
    jest.spyOn(mockAccountManager, 'logTransaction')
    await account.deposit(40)
    expect(mockAccountManager.logTransaction).toHaveBeenCalledWith('deposit', 40)
  })

  test('should display the menu', () => {
    showMenu()
    expect(logSpy).toHaveBeenNthCalledWith(1, 'Welcome to our bank')
    expect(logSpy).toHaveBeenNthCalledWith(2, '1. Create Account')
    expect(logSpy).toHaveBeenNthCalledWith(3, '2. Deposit money')
    expect(logSpy).toHaveBeenNthCalledWith(4, '3. Withdraw money')
    expect(logSpy).toHaveBeenNthCalledWith(5, '4. Exit')
  })

})
