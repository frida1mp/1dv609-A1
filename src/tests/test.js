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

test('should create an account with an initial balance of 0', () => {
  const account = new Account()
  expect(account.getBalance()).toBe(0)
})

test('should deposit money into the current balance', () => {
  const mockAccountManager = new AccountManager()

  const account = new Account(mockAccountManager)
  account.deposit(50)
  expect(account.getBalance()).toBe(50)
})

test('should log transaction message after depositing money', () => {
  const mockAccountManager = new AccountManager()
  const account = new Account(mockAccountManager)

  account.deposit(40)
  expect(account.deposit(40)).toBe(`Deposited ${40}`)
})

