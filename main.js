const balance = document.getElementById("balance");
const incomeAmount = document.getElementById("income-amount");
const expenseAmount = document.getElementById("expense-amount");
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
function saveLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

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

  if (!desc || isNaN(amt) || amt === 0) {
    alert("Không hợp lệ xin vui lòng nhập lại");
    return;
  }

  transactions.push({
    id: Date.now(),
    desc,
    amt,
    date: new Date().toISOString(),
  });

  saveLocalStorage();
  updateTransactionList();
  updateSummary();

  transactionForm.reset();
}

// Delete transaction
function deleteTransaction(id) {
  const isConfirmed = confirm("Bạn có chắc muốn xoá giao dịch này không?");
  if (!isConfirmed) return;

  transactions = transactions.filter((t) => t.id !== id);
  saveLocalStorage();
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
  let income = 0;
  let expense = 0;

  transactions.forEach((t) => {
    if (t.amt > 0) {
      income += t.amt;
    } else {
      expense += t.amt;
    }
  });

  const total = income + expense;

  balance.textContent = formatCurrency(total);
  balance.classList.toggle("negative", total < 0);
  incomeAmount.textContent = formatCurrency(income);
  expenseAmount.textContent = formatCurrency(Math.abs(expense));
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
