const balance = document.getElementById("balance");
const incomeAmount = document.getElementById("income-amount");
const expenseAmout = document.getElementById("expense-amount");
const transactionList = document.getElementById("transaction-list");
const transactionForm = document.getElementById("transaction-form");
const description = document.getElementById("description");
const amount = document.getElementById("amount");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Initial render
updateTransactionList();
updateSummary();

transactionForm.addEventListener("submit", addTransaction);

// Helper functions

function formatDate(isoString) {
  if (!isoString) return "Không xác định";
  const date = new Date(isoString);

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatCurrency(num) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num);
}

// Add new transaction
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

// Delete transaction
function deleteTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  updateTransactionList();
  updateSummary();
}

// Update transaction list
function updateTransactionList() {
  transactionList.innerHTML = "";

  const sortedTransactions = [...transactions].reverse();

  sortedTransactions.forEach((transaction) => {
    const transactionEl = createTransactionElement(transaction);
    transactionList.appendChild(transactionEl);
  });
}

// Update summary
function updateSummary() {
  const income = transactions
    .filter((t) => t.amt > 0)
    .reduce((sum, t) => sum + t.amt, 0);
  const expense = transactions
    .filter((t) => t.amt < 0)
    .reduce((sum, t) => sum + t.amt, 0);

  balance.textContent = formatCurrency(income + expense);
  incomeAmount.textContent = formatCurrency(income);
  expenseAmout.textContent = formatCurrency(Math.abs(expense));
}

// Create transaction list item

function createTransactionElement(transaction) {
  const li = document.createElement("li");
  li.classList.add("transaction");
  li.classList.add(transaction.amt > 0 ? "income" : "expenses");

  li.innerHTML = `
    <div class="transaction-info">
      <span class="transaction-desc">${transaction.desc}</span>
      <span class="transaction-date">${formatDate(transaction.date)}</span>
    </div>
    <div>
      <span class="transaction-amount">${formatCurrency(transaction.amt)}
      </span>
      <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">X</button>
    </div>
  `;

  return li;
}
