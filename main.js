const balance = document.getElementById("balance");
const incomeAmount = document.getElementById("income-amount");
const expenseAmout = document.getElementById("expense-amount");
const transactionList = document.getElementById("transaction-list");
const transactionForm = document.getElementById("transaction-form");
const description = document.getElementById("description");
const amount = document.getElementById("amount");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

transactionForm.addEventListener("submit", addTransaction);

function addTransaction(e) {
  e.preventDefault();

  const desc = description.value.trim();
  const amt = parseFloat(amount.value.trim());

  transactions.push({
    id: Date.now(),
    desc,
    amt,
    date: new Date().toISOString(),
  });

  localStorage.setItem("transactions", JSON.stringify(transactions));

  updateTransactionList();
  updateSummary();

  transactionForm.reset();
}

function formatDate(ioString) {
  if (!ioString) return "Không xác định";
  const date = new Date(ioString);

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

function updateTransactionList() {
  transactionList.innerHTML = "";

  const sortedTransactions = [...transactions].reverse();

  sortedTransactions.forEach((transaction) => {
    const transactionEl = createTransactionElement(transaction);
    transactionList.appendChild(transactionEl);
  });
}

function createTransactionElement(transaction) {
  const li = document.createElement("li");
  li.classList.add("transaction");
  li.classList.add(transaction.amt > 0 ? "income" : "expense");

  li.innerHTML = `
    <span>${transaction.desc}</span>
    <span>$${Math.abs(transaction.amt).toFixed(2)}
       <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">X</button>
    </span>
  `;

  return li;
}
