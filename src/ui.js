import readline from 'node:readline'
import { Account } from './account.js'
import { AccountManager } from './accountManager.js'

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

const userInput = (question) => {
    return new Promise((resolve) => rl.question(question, resolve))
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
            const depositAmount = await getUserInput("Enter deposit amount: ")
            account.deposit(parseFloat(depositAmount))
            console.log("Money deposited!")
            break
        case '3':
            if (!account) {
                console.log("Please create an account first.")
                break
            }
            const withdrawAmount = await getUserInput("Enter withdrawal amount: ")
            try {
                account.withdraw(parseFloat(withdrawAmount))
                console.log("Money withdrawn!")
            } catch (error) {
                console.log(error.message)
            }
            break
        case '4':
            if (!account) {
                console.log("Please create an account first.")
                break
            }
            console.log("Transaction History:")
            console.log(account.accountManager.transaction)
            break
        case '5':
            console.log("Exiting application...")
            rl.close()
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
}

runApp()

export { showMenu, userInput, rl }