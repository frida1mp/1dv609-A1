import { Account } from "../account.js"


test('should create an account with an initial balance of 0', () => {
  const account = new Account();
  expect(account.getBalance()).toBe(0);
})

test('should deposit money into the current balance', () => {
  const account = new Account();
  account.deposit(50)
  expect(account.getBalance()).toBe(50);
})