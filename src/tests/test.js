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

jest.mock('node:readline', () => {
  const originalModule = jest.requireActual('node:readline')
  return {
    ...originalModule,
    createInterface: jest.fn().mockReturnValue({
      question: jest.fn((query, callback) => {
        if (query === 'Choose an option: ') {
          callback('1')
        } else if (query === 'Enter deposit amount: ') {
          callback('50')
        } else {
          callback('4')
        }
      }),
      close: jest.fn(),s
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

    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(account, 'deposit')
    mockQuestion = jest.spyOn(rl, 'question')
  })

  afterEach(() => {
    jest.restoreAllMocks()
    rl.close()
    account = undefined
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

  test('should throw error when no account and choice is 2', async () => {
    account = undefined
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

    await handleUserChoice('2')

    expect(logSpy).toHaveBeenCalledWith('Please create an account first.')
    logSpy.mockRestore()
  })

  test('should return user input to question', async () => {
    const mockQuestion = jest.spyOn(rl, 'question').mockImplementation((_, callback) => {
      callback('50')
    })
    const result = await userInput('Enter something: ')
    console.log('test1,', result)
    expect(result).toBe('50')
    expect(mockQuestion).toHaveBeenCalledWith('Enter something: ', expect.any(Function))
  })

  test('should withdraw money when choice is 3', async () => {
    account = new Account(new AccountManager(Transaction))

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

    await handleUserChoice('3')

    expect(logSpy).toHaveBeenCalledWith('50kr has been withdrawn!')
    logSpy.mockRestore()
  })

  test('should run the app', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

  mockQuestion
    .mockImplementationOnce((question, callback) => callback('1')) 
    .mockImplementationOnce((question, callback) => callback('2')) 
    .mockImplementationOnce((question, callback) => callback('50'))
    .mockImplementationOnce((question, callback) => callback('4'))

    await runApp();

  expect(logSpy).toHaveBeenCalledWith('Welcome to our bank');
  expect(logSpy).toHaveBeenCalledWith('Creating you new account...');
  expect(logSpy).toHaveBeenCalledWith('Account created successfully!');
  expect(logSpy).toHaveBeenCalledWith('50kr has been deposited!');
  expect(logSpy).toHaveBeenCalledWith('Thank you for using the Banking App!');

  logSpy.mockRestore()
  })
})
