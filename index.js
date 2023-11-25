const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

class Account {
  constructor(holderName, pin, balance) {
    this.holderName = holderName;
    this.pin = pin;
    this.balance = balance;
    this.transactions = [];
  }

  deposit(amount) {
    this.balance += amount;
    this.transactions.push(`Deposited $${amount}`);
    return `Deposit successful. New balance: $${this.balance}`;
  }

  withdraw(amount) {
    if (amount <= this.balance) {
      this.balance -= amount;
      this.transactions.push(`Withdrawn $${amount}`);
      return `Withdrawal successful. New balance: $${this.balance}`;
    } else {
      return "Insufficient funds.";
    }
  }

  checkBalance() {
    return `Your current balance: $${this.balance}`;
  }

  changePin(newPin) {
    this.pin = newPin;
    return "PIN changed successfully.";
  }
}

const accounts = {
  1234567890: new Account("John Doe", "1234", 1000.0),
  "0987654321": new Account("Jane Doe", "5678", 1500.0),
};

let currentAccount;

function authenticate() {
  return new Promise((resolve, reject) => {
    rl.question("Enter your card number: ", (cardNumber) => {
      rl.question("Enter your PIN: ", (pin) => {
        if (accounts[cardNumber] && accounts[cardNumber].pin === pin) {
          currentAccount = accounts[cardNumber];
          resolve(`Welcome, ${currentAccount.holderName}!`);
        } else {
          reject("Invalid card number or PIN. Please try again.");
        }
      });
    });
  });
}

function displayMenu() {
  console.log("\nATM Menu:");
  console.log("1. Deposit");
  console.log("2. Withdraw");
  console.log("3. Check Balance");
  console.log("4. Change PIN");
  console.log("5. Logout");
}

function handleMenuChoice(choice) {
  switch (choice) {
    case "1":
      rl.question("Enter the amount to deposit: ", (amount) => {
        handleDeposit(parseFloat(amount));
      });
      break;
    case "2":
      rl.question("Enter the amount to withdraw: ", (amount) => {
        handleWithdraw(parseFloat(amount));
      });
      break;
    case "3":
      handleCheckBalance();
      break;
    case "4":
      rl.question("Enter your new PIN: ", (newPin) => {
        handleChangePin(newPin);
      });
      break;
    case "5":
      handleLogout();
      break;
    default:
      console.log("Invalid choice. Please try again.");
      break;
  }
}

function handleDeposit(amount) {
  if (!isNaN(amount) && amount > 0) {
    console.log(currentAccount.deposit(amount));
  } else {
    console.log("Invalid amount. Please enter a valid positive number.");
  }
  displayMenu();
  getUserChoice();
}

function handleWithdraw(amount) {
  if (!isNaN(amount) && amount > 0) {
    console.log(currentAccount.withdraw(amount));
  } else {
    console.log("Invalid amount. Please enter a valid positive number.");
  }
  displayMenu();
  getUserChoice();
}

function handleCheckBalance() {
  console.log(currentAccount.checkBalance());
  displayMenu();
  getUserChoice();
}

function handleChangePin(newPin) {
  console.log(currentAccount.changePin(newPin));
  displayMenu();
  getUserChoice();
}

function handleLogout() {
  console.log("Thank you for using our ATM. Goodbye!");
  rl.close();
}

function getUserChoice() {
  rl.question("Enter your choice: ", (choice) => {
    handleMenuChoice(choice);
  });
}

(async () => {
  try {
    console.log(await authenticate());
    displayMenu();
    getUserChoice();
  } catch (error) {
    console.log(error);
    rl.close();
  }
})();
