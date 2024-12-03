import { Account } from '../account.js'
import readline from 'node:readline'
import { afterAll, afterEach, expect, jest } from '@jest/globals'
import { AccountManager } from '../accountManager.js'
import { Transaction } from '../transaction.js'
import { showMenu, handleUserChoice, rl, userInput, runApp } from '../ui.js'

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

jest.mock('readline', () => {
  const originalModule = jest.requireActual('readline')
  return {
    ...originalModule,
    createInterface: jest.fn().mockReturnValue({
      question: jest.fn((query, callback) => {
        if (query === 'Choose an option: ') {
          callback('1')
        } else if (query === 'Enter username: ') {
          callback('testUser')
        } else if (query === 'Enter deposit amount: ') {
          callback('50')
        } else if (query === 'Enter withdrawal amount: ') {
          callback('50')
        } else {
          callback('4')
        }
      }),
      close: jest.fn(),
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


beforeAll(() => {
  process.env.NODE_ENV = 'test'
})

describe('BankingManger', () => {
  let account
  let mockAccountManager
  let logSpy
  let mockQuestion

  beforeEach(() => {
    mockAccountManager = new AccountManager(Transaction)
    account = new Account(mockAccountManager)

    logSpy = jest.spyOn(console, 'log').mockImplementation(() => { })
    jest.spyOn(account, 'deposit')
    jest.spyOn(account, 'withdraw')
    jest.spyOn(rl, 'close').mockImplementation(() => { })
    mockQuestion = jest.spyOn(rl, 'question')
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
    // jest.spyOn(rl, 'close').mockImplementation(() => { /* Do nothing */ })
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

  test('should deposit money when choice is 2', async () => {
    jest.setTimeout(10000)
    account = new Account(new AccountManager(Transaction))

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => { })

    await handleUserChoice('2', account)

    expect(logSpy).toHaveBeenCalledWith('50kr has been deposited!')
    logSpy.mockRestore()
  })

  test('should throw error when no account and choice is 2', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => { })

    await handleUserChoice('2', undefined)

    expect(logSpy).toHaveBeenCalledWith('Please create an account first.')
    logSpy.mockRestore()
  })

  test('should return user input to question', async () => {
    const mockQuestion = jest.spyOn(rl, 'question').mockImplementation((_, callback) => {
      callback('50')
    })
    const result = await userInput('Enter deposit: ')
    console.log('test1,', result)
    expect(result).toBe('50')
    expect(mockQuestion).toHaveBeenCalledWith('Enter deposit: ', expect.any(Function))
  })

  test('should withdraw money when choice is 3', async () => {
    account = new Account(new AccountManager(Transaction))

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => { })

    await handleUserChoice('3', account)

    expect(logSpy).toHaveBeenCalledWith('50kr has been withdrawn!')
    logSpy.mockRestore()
  })

  test('should throw error when no account and choice is 3', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => { })

    await handleUserChoice('3', undefined)

    expect(logSpy).toHaveBeenCalledWith('Please create an account first.')
    logSpy.mockRestore()
  })

  test('should run the app', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => { })

    mockQuestion
      .mockResolvedValueOnce('1')  // Select "Create Account"
      .mockResolvedValueOnce('testUser')  // Username input
      .mockResolvedValueOnce('50')  // Deposit input
      .mockResolvedValueOnce('4')  // Exit

    runApp()

    expect(logSpy).toHaveBeenNthCalledWith(1, 'Welcome to our bank')
    expect(logSpy).toHaveBeenNthCalledWith(2, '1. Create Account')
    expect(logSpy).toHaveBeenNthCalledWith(3, '2. Deposit money')
    expect(logSpy).toHaveBeenNthCalledWith(4, '3. Withdraw money')
    expect(logSpy).toHaveBeenNthCalledWith(5, '4. Exit')

    // expect(logSpy).toHaveBeenCalledWith('Welcome to our bank')
    // expect(logSpy).toHaveBeenCalledWith('Creating your new account...')
    // expect(logSpy).toHaveBeenCalledWith('testUser, your account was created successfully!')
    // expect(logSpy).toHaveBeenCalledWith('50kr has been deposited!')
    // expect(logSpy).toHaveBeenCalledWith('Thank you for using the Banking App!')

    logSpy.mockRestore()
  })

  test('should return username', () => {
    expect(account.getUser()).toBe('')
  })

  test('should return username', () => {
    account.setUsername('testUser')
    expect(account.getUser()).toBe('testUser')
  })

  test('should create user with given username', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    let account

    account =  await handleUserChoice('1', undefined)

    expect(logSpy).toHaveBeenCalledWith('Creating your new account...')
    expect(logSpy).toHaveBeenCalledWith('testUser, your account was created successfully!')

    expect(account.getUser()).toBe('testUser')

    logSpy.mockRestore()
  })
})
