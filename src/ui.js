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

const handleUserChoice = async (choice) => {
    switch (choice) {
        case '1':
            console.log('Creating you new account...')
            account = new Account(new AccountManager(Transaction))
            console.log('Account created successfully!')
            break
        case '2':
            if (!account) {
                console.log("Please create an account first.")
                break
            }
            const depositAmount = '50' //await userInput("Enter deposit amount: ")
            account.deposit(parseFloat(depositAmount))
            console.log(`${depositAmount}kr has been deposited!`)
            break
        
        default:
            console.log("Invalid choice. Please try again.")
    }
}

const runApp = async () => {
    let running = true

    while (running) {
        showMenu()
        const choice = await userInput("Choose an option: ")
        if (choice === '5') {
            running = false
        }
        await handleUserChoice(choice)
    }
    console.log("Thank you for using the Banking App!")
    if (!process.env.JEST_ENV) {
        rl.close()
    }
}
runApp()

export { showMenu, userInput, handleUserChoice, rl }