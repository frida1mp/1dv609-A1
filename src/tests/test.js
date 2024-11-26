import { Account } from "../account.js"
import { expect, jest } from '@jest/globals'
import { AccountManager } from "../accountManager.js"

jest.mock("./src/accountManager.js", () => {
  return {
    AccountManager: jest.fn().mockImplementation(() => {
      return {
        logTransaction: jest.fn() // Mock logTransaction method
      }
    })
  }
})
describe('BookingManager', () => {
  let account

  beforeEach(() => {
    const mockAccountManager = new AccountManager()
    account = new Account(mockAccountManager)
  })


  test('should create an account with an initial balance of 0', () => {
    expect(account.getBalance()).toBe(0)
  })

  test('should deposit money into the current balance', () => {
    account.deposit(50)
    expect(account.getBalance()).toBe(50)
  })

  test('should log transaction message after depositing money', () => {
    account.deposit(40)
    expect(account.deposit(40)).toBe(`Deposited ${40}`)
  })

  test('should throw exception', () => {
    expect(() => account.deposit("50")).toThrow("Deposit amount must be a valid positive number.")
  })

  test('should withdraw money from the current balance', () => {
    account.withdraw(40)
    expect(account.getBalance()).toBe(-40)
  })


  test('should log transaction message after withdrawing money', () => {
    account.withdraw(40)
    expect(account.withdraw(40)).toBe(`Deposited ${-40}`)
  })
})