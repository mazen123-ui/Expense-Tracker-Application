let addExpenseBtn = document.getElementById("add-expense-btn");
let modalOverlay = document.getElementById("modal-overlay");
let closeModalIcon = document.getElementById("close-modal");
let cancelModalBtn = document.getElementById("cancel-btn");
let expenseForm = document.getElementById("expense-form");
let expenseList = document.getElementById("expense-list");
let totalAmountOfExpenses = document.querySelector(".total-amount");
let filterTabs = document.querySelectorAll(".filter-tab");
let totalExpenses = 0;
let currentFilter = "all"; // global varibale
let updateId = null;

// get expenses from localstorage
function getExpensesFromLocalstorage() {
  return JSON.parse(localStorage.getItem("expenses")) || [];
}
// set expenses to localstorage
function setExpensesToLocalstorage(expenses) {
  return localStorage.setItem("expenses", JSON.stringify(expenses));
}

// opening and closing the modal
function closeModel() {
  modalOverlay.style.display = "none";
}
addExpenseBtn.addEventListener("click", () => {
  modalOverlay.style.display = "flex";
  expenseForm.reset();
  document.getElementById("submit-btn").textContent = "Save Expense";
  updateId = null;
});
closeModalIcon.addEventListener("click", closeModel);
cancelModalBtn.addEventListener("click", closeModel);

// render expenses to the body
function renderExpenses() {
  let expenses = getExpensesFromLocalstorage();
  expenseList.innerHTML = "";
  totalExpenses = 0; // Reset total to prevent accumulation errors

  let updatedExpenses = expenses; // all expenses
  if (currentFilter !== "all") {
    updatedExpenses = expenses.filter(
      (expense) => expense.category === currentFilter,
    );
  }
  updatedExpenses.forEach((expense) => {
    let expenseDiv = document.createElement("div");
    expenseDiv.classList.add("expense-card");
    expenseDiv.setAttribute("data-category", expense.category);

    // Icon Logic
    let iconClass = "ri-question-line";
    if (expense.category === "shopping") iconClass = "ri-shopping-bag-line";
    else if (expense.category === "food") iconClass = "ri-restaurant-line";
    else if (expense.category === "transport") iconClass = "ri-car-line";

    expenseDiv.innerHTML = `
        <div class="card-icon ${expense.category}">
            <i class="${iconClass}"></i>
        </div>
        <div class="card-info">
            <h3>${expense.name}</h3>
            <div class="card-meta">
                <span class="category-tag">${expense.category}</span>
                <span class="date">${expense.date}</span>
            </div>
        </div>
        <div class="card-amount">
            <span class="amount">-$${Number(expense.amount)}</span>
            <div class="card-actions">
                <button class="btn-icon edit" title="Edit" onclick="editExpense(${expense.id})">
                    <i class="ri-edit-line"></i>
                </button>
                <button class="btn-icon delete" title="Delete" onclick="deleteExpense(${expense.id})">
                    <i class="ri-delete-bin-line"></i>
                </button>
            </div>
        </div>
    `;
    expenseList.appendChild(expenseDiv);
    totalExpenses += Number(expense.amount);
  });

  totalAmountOfExpenses.textContent = `$${totalExpenses}`;
}

expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let expenses = getExpensesFromLocalstorage();
  let expenseName = document.getElementById("expense-name").value;
  let expenseAmount = document.getElementById("expense-amount").value;
  let expenseCategory = document.getElementById("expense-category").value;
  let expenseDate = document.getElementById("expense-date").value;

  if (updateId === null) {
    // Add new expense
    expenses.push({
      id: Date.now(),
      name: expenseName,
      amount: expenseAmount,
      category: expenseCategory,
      date: expenseDate,
    });
    setExpensesToLocalstorage(expenses);
    renderExpenses();
    closeModel();
    expenseForm.reset();
  } else {
    // Update expense
    let updatedExpenses = expenses.map((expense) => {
      if (expense.id === updateId) {
        return {
          ...expense,
          name: expenseName,
          amount: expenseAmount,
          category: expenseCategory,
          date: expenseDate,
        };
      } else {
        return expense;
      }
    });
    setExpensesToLocalstorage(updatedExpenses);
    renderExpenses();
    alert("Expense Updated!!!");
    closeModel();
    expenseForm.reset();
    updateId = null;
  }
});

// edit expense
function editExpense(id) {
  let expenses = getExpensesFromLocalstorage();
  let expense = expenses.find((expense) => expense.id === id);
  modalOverlay.style.display = "flex";
  document.getElementById("expense-name").value = expense.name;
  document.getElementById("expense-amount").value = expense.amount;
  document.getElementById("expense-category").value = expense.category;
  document.getElementById("expense-date").value = expense.date;
  document.getElementById("submit-btn").textContent = "Update Expense";
  updateId = id;
}
// delete expense from localstorag
function deleteExpense(id) {
  if (confirm("Do You Really Wanna Delete This Expense?")) {
    let expenses = getExpensesFromLocalstorage();
    let updatedExpenses = expenses.filter((expense) => expense.id !== id);
    setExpensesToLocalstorage(updatedExpenses);
    renderExpenses();
  }
}

// handle tab active
filterTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    filterTabs.forEach((tab) => {
      tab.classList.remove("active");
    });
    tab.classList.add("active");
    currentFilter = tab.dataset.filter;
    renderExpenses();
  });
});

window.addEventListener("load", () => {
  renderExpenses();
});
