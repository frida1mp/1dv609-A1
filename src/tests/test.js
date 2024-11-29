import { Account } from '../account.js'
import readline from 'node:readline'
import { afterAll, afterEach, expect, jest } from '@jest/globals'
import { AccountManager } from '../accountManager.js'
import { Transaction } from '../transaction.js'
import { showMenu, handleUserChoice, rl, userInput } from '../ui.js'

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

jest.mock('./src/ui.js', () => ({
  ...jest.requireActual('../ui.js'),
  rl: {
    question: jest.fn(),
    close: jest.fn(),
    on: jest.fn(),
  }
}))

describe('BookingManager', () => {
  let account
  let mockAccountManager
  let logSpy

  beforeEach(() => {
    jest.restoreAllMocks()
    mockAccountManager = new AccountManager(Transaction)
    account = new Account(mockAccountManager)

    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(account, 'deposit')
  })

  afterEach(() => {
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

  test('should handle choice for creating an account', async () => {
    await handleUserChoice('1') 

    expect(logSpy).toHaveBeenCalledWith('Creating you new account...')
    expect(logSpy).toHaveBeenCalledWith('Account created successfully!')
    expect(account).toBeDefined()
  })

  test('should deposit money when choice is 2', async () => {
    account = new Account(new AccountManager(Transaction))

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

    await handleUserChoice('2')

    expect(logSpy).toHaveBeenCalledWith('50kr has been deposited!')
    logSpy.mockRestore()
  })

  test('should return user input to question', async () => {
    const mockQuestion = jest.spyOn(rl, 'question').mockImplementation((_, callback) => {
      callback('test input')
    })
    const result = await userInput('Enter something: ')
    expect(result).toBe('test input')
    expect(mockQuestion).toHaveBeenCalledWith('Enter something: ', expect.any(Function))
  })
})
