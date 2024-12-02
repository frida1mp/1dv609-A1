import readline from 'node:readline'
import { Account } from './account.js'
import { AccountManager } from './accountManager.js'
import { Transaction } from './transaction.js'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const showMenu = () => {
    console.log('Welcome to our bank')
    console.log('1. Create Account')
    console.log('2. Deposit money')
    console.log('3. Withdraw money')
    console.log('4. Exit')
}

const userInput = async (question) => {
    const questionA = await new Promise((resolve) => rl.question(question, resolve))
    return questionA
}

let account

const handleUserChoice = async (choice, account) => {
    switch (choice) {
        case '1':
            console.log('Creating you new account...')
            const username = 'test'//await userInput("Enter username: ")
            account = new Account(new AccountManager(Transaction))
            console.log('Account created successfully!')
        case '2':
            if (!account) {
                console.log("Please create an account first.")
                break
            }
            const depositAmount = '50' //await userInput("Enter deposit amount: ")
            account.deposit(parseFloat(depositAmount))
            console.log(`${depositAmount}kr has been deposited!`)
            break
        case '3':
            if (!account) {
                console.log("Please create an account first.")
                break
            }
            const withdrawAmount = '50' //await userInput("Enter deposit amount: ")
            account.deposit(parseFloat(withdrawAmount))
            console.log(`${withdrawAmount}kr has been withdrawn!`)
            break

        default:
            console.log("Invalid choice. Please try again.")
    }
    return account
}

const runApp = async () => {
    let running = true
    while (running) {
        showMenu()
        const choice = await userInput("Choose an option: ")
        if (choice === '4') {
            running = false
        } else {
            account = await handleUserChoice(choice, account)
        }
    }
    console.log("Thank you for using the Banking App!")
    if (!process.env.NODE_ENV !== 'test') {
        rl.close()
    }
}
runApp()

export { showMenu, handleUserChoice, rl, userInput, runApp }