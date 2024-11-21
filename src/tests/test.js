import { Account } from "../account.js"
import { jest } from '@jest/globals'

function createAccountWithMockManager() {
  const mockAccountManager = { logTransaction: jest.fn() };
  const account = new Account(mockAccountManager);
  return { account, mockAccountManager };
}

test('should create an account with an initial balance of 0', () => {
  const account = new Account()
  expect(account.getBalance()).toBe(0)
})

test('should deposit money into the current balance', () => {
  const {account} = createAccountWithMockManager()
  account.deposit(50)
  expect(account.getBalance()).toBe(50)
})


