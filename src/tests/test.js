import { Account } from "../account.js"


test('should create an account with an initial balance of 0', () => {
    const account = new Account();
    expect(account.getBalance()).toBe(0);
  });