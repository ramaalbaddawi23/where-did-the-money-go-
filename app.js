/* ==========================================================================
   وين راحت المصاريف؟ - وظائف التطبيق
   JavaScript: عرض العمليات، الحسابات، الإضافة، الحذف، التعديل، البحث والحفظ.
   ========================================================================== */

"use strict";

const STORAGE_KEY = "qafza_transactions_v1";
let transactions = [];
let selectedType = "expense";
let selectedTransactionTypeFilter = "all";

const elements = {
  form: document.getElementById("transaction-form"),
  id: document.getElementById("tx-id"),
  type: document.getElementById("tx-type"),
  title: document.getElementById("tx-title"),
  amount: document.getElementById("tx-amount"),
  category: document.getElementById("tx-category"),
  date: document.getElementById("tx-date"),
  expenseButton: document.getElementById("type-btn-expense"),
  incomeButton: document.getElementById("type-btn-income"),
  submitText: document.getElementById("btn-submit-text"),
  formHeading: document.getElementById("form-heading"),
  editActions: document.getElementById("edit-actions"),
  cancelEdit: document.getElementById("btn-cancel-edit"),
  search: document.getElementById("search-input"),
  typePills: document.getElementById("type-pills"),
  periodFilter: document.getElementById("period-filter"),
  categoryFilter: document.getElementById("category-filter"),
  resetData: document.getElementById("btn-reset-data"),
  list: document.getElementById("transactions-list"),
  empty: document.getElementById("empty-state"),
  count: document.getElementById("tx-count-badge"),
  balance: document.getElementById("total-balance"),
  income: document.getElementById("total-income"),
  expense: document.getElementById("total-expense"),
  toastContainer: document.getElementById("toast-container")
};

function formatMoney(value) {
  return new Intl.NumberFormat("ar-JO", {
    style: "currency",
    currency: "JOD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat("ar-JO", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  const icon = document.createElement("i");
  icon.className = type === "danger"
    ? "fa-solid fa-circle-exclamation"
    : type === "info"
      ? "fa-solid fa-circle-info"
      : "fa-solid fa-circle-check";
  const text = document.createElement("span");
  text.textContent = message;
  toast.append(icon, text);
  elements.toastContainer.appendChild(toast);
  window.setTimeout(() => toast.remove(), 3000);
}

function saveTransactions() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    showToast("تعذر حفظ البيانات في هذا المتصفح.", "danger");
  }
}

function loadTransactions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.warn("Could not read saved transactions:", error);
  }
  return initialTransactions.map(transaction => ({ ...transaction }));
}

function updateSummary() {
  const totalIncome = transactions
    .filter(transaction => transaction.type === "income")
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

  const totalExpense = transactions
    .filter(transaction => transaction.type === "expense")
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

  elements.income.textContent = formatMoney(totalIncome);
  elements.expense.textContent = formatMoney(totalExpense);
  elements.balance.textContent = formatMoney(totalIncome - totalExpense);
}

function makeActionButton(action, id, iconClass, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `action-icon-btn ${action}`;
  button.dataset.action = action;
  button.dataset.id = String(id);
  button.title = label;
  button.setAttribute("aria-label", label);
  const icon = document.createElement("i");
  icon.className = iconClass;
  button.appendChild(icon);
  return button;
}

function isInSelectedPeriod(transaction) {
  const period = elements.periodFilter.value;
  if (period === "all") return true;

  // Use local calendar dates so the filters behave consistently in the user's timezone.
  const transactionDate = new Date(`${transaction.date}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (period === "week") {
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);
    return transactionDate >= sevenDaysAgo && transactionDate <= today;
  }

  if (period === "month") {
    return transactionDate.getFullYear() === today.getFullYear()
      && transactionDate.getMonth() === today.getMonth();
  }

  return true;
}

function renderTransactions() {
  const query = elements.search.value.trim().toLocaleLowerCase("ar");
  const selectedCategory = elements.categoryFilter.value;
  const visibleTransactions = transactions
    .filter(transaction => {
      const searchable = `${transaction.title} ${transaction.category}`.toLocaleLowerCase("ar");
      const matchesSearch = searchable.includes(query);
      const matchesType = selectedTransactionTypeFilter === "all"
        || transaction.type === selectedTransactionTypeFilter;
      const matchesCategory = selectedCategory === "all" || transaction.category === selectedCategory;
      return matchesSearch && matchesType && matchesCategory && isInSelectedPeriod(transaction);
    })
    .sort((a, b) => b.date.localeCompare(a.date) || Number(b.id) - Number(a.id));

  elements.list.replaceChildren();
  elements.count.textContent = `${visibleTransactions.length} معاملة`;
  elements.empty.style.display = visibleTransactions.length ? "none" : "block";

  visibleTransactions.forEach(transaction => {
    const item = document.createElement("li");
    item.className = "transaction-item";

    const main = document.createElement("div");
    main.className = "tx-main";

    const iconBox = document.createElement("div");
    iconBox.className = `tx-icon ${transaction.type}`;
    const icon = document.createElement("i");
    icon.className = transaction.type === "income"
      ? "fa-solid fa-arrow-trend-up"
      : "fa-solid fa-receipt";
    iconBox.appendChild(icon);

    const details = document.createElement("div");
    details.className = "tx-details";
    const title = document.createElement("div");
    title.className = "tx-title";
    title.textContent = transaction.title;

    const meta = document.createElement("div");
    meta.className = "tx-meta";
    const category = document.createElement("span");
    category.textContent = transaction.category;
    const date = document.createElement("span");
    date.textContent = formatDate(transaction.date);
    meta.append(category, date);
    details.append(title, meta);
    main.append(iconBox, details);

    const end = document.createElement("div");
    end.className = "tx-end";
    const amount = document.createElement("div");
    amount.className = `tx-amount ${transaction.type}`;
    amount.textContent = `${transaction.type === "income" ? "+" : "−"}${formatMoney(Number(transaction.amount))}`;

    const actions = document.createElement("div");
    actions.className = "tx-actions";
    actions.append(
      makeActionButton("edit", transaction.id, "fa-solid fa-pen", "تعديل المعاملة"),
      makeActionButton("delete", transaction.id, "fa-solid fa-trash", "حذف المعاملة")
    );
    end.append(amount, actions);
    item.append(main, end);
    elements.list.appendChild(item);
  });

  updateSummary();
}

function setType(type) {
  selectedType = type;
  elements.type.value = type;
  elements.expenseButton.classList.toggle("active", type === "expense");
  elements.incomeButton.classList.toggle("active", type === "income");
  elements.expenseButton.classList.toggle("expense", type === "expense");
  elements.incomeButton.classList.toggle("income", type === "income");
}

function resetForm() {
  elements.form.reset();
  elements.id.value = "";
  elements.date.value = getTodayDate();
  setType("expense");
  elements.submitText.textContent = "إضافة المعاملة";
  elements.formHeading.querySelector("span").textContent = "إضافة معاملة جديدة";
  elements.editActions.style.display = "none";
  elements.amount.value = "";
}

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function handleSubmit(event) {
  event.preventDefault();

  const title = elements.title.value.trim();
  const amount = Number(elements.amount.value);
  const category = elements.category.value;
  const date = elements.date.value;

  if (!title || !category || !date || !Number.isFinite(amount) || amount <= 0) {
    showToast("تأكدي من تعبئة جميع الحقول وإدخال مبلغ أكبر من صفر.", "danger");
    return;
  }

  const editingId = elements.id.value;
  if (editingId) {
    const index = transactions.findIndex(transaction => String(transaction.id) === editingId);
    if (index !== -1) {
      transactions[index] = {
        ...transactions[index],
        title,
        amount,
        type: selectedType,
        category,
        date
      };
      showToast("تم تحديث المعاملة بنجاح.");
    }
  } else {
    const newTransaction = {
      id: Date.now(),
      title,
      amount,
      type: selectedType,
      category,
      date
    };
    transactions.push(newTransaction);
    showToast(selectedType === "income" ? "تمت إضافة الدخل بنجاح." : "تمت إضافة المصروف بنجاح.");
  }

  saveTransactions();
  renderTransactions();
  resetForm();
}

function startEditing(id) {
  const transaction = transactions.find(item => String(item.id) === String(id));
  if (!transaction) return;

  elements.id.value = transaction.id;
  elements.title.value = transaction.title;
  elements.amount.value = transaction.amount;
  elements.category.value = transaction.category;
  elements.date.value = transaction.date;
  setType(transaction.type);
  elements.submitText.textContent = "حفظ التعديلات";
  elements.formHeading.querySelector("span").textContent = "تعديل المعاملة";
  elements.editActions.style.display = "flex";
  elements.title.focus();
  document.getElementById("transaction-form-card").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function deleteTransaction(id) {
  const transaction = transactions.find(item => String(item.id) === String(id));
  if (!transaction) return;

  if (!window.confirm(`هل أنتِ متأكدة من حذف "${transaction.title}"؟`)) return;

  transactions = transactions.filter(item => String(item.id) !== String(id));
  saveTransactions();
  renderTransactions();
  if (elements.id.value === String(id)) resetForm();
  showToast("تم حذف المعاملة.");
}

function attachEvents() {
  elements.form.addEventListener("submit", handleSubmit);
  elements.expenseButton.addEventListener("click", () => setType("expense"));
  elements.incomeButton.addEventListener("click", () => setType("income"));
  elements.cancelEdit.addEventListener("click", resetForm);
  elements.search.addEventListener("input", renderTransactions);
  elements.periodFilter.addEventListener("change", renderTransactions);
  elements.categoryFilter.addEventListener("change", renderTransactions);

  elements.typePills.addEventListener("click", event => {
    const button = event.target.closest("button[data-filter]");
    if (!button) return;
    selectedTransactionTypeFilter = button.dataset.filter;
    elements.typePills.querySelectorAll("button[data-filter]").forEach(pill => {
      const isActive = pill === button;
      pill.classList.toggle("active", isActive);
      pill.setAttribute("aria-pressed", String(isActive));
    });
    renderTransactions();
  });

  elements.resetData.addEventListener("click", () => {
    if (!window.confirm("سيتم استبدال عملياتك الحالية بالبيانات التجريبية الأصلية. هل تريدين المتابعة؟")) return;
    transactions = initialTransactions.map(transaction => ({ ...transaction }));
    saveTransactions();
    elements.search.value = "";
    elements.periodFilter.value = "all";
    elements.categoryFilter.value = "all";
    selectedTransactionTypeFilter = "all";
    elements.typePills.querySelectorAll("button[data-filter]").forEach(pill => {
      const isActive = pill.dataset.filter === "all";
      pill.classList.toggle("active", isActive);
      pill.setAttribute("aria-pressed", String(isActive));
    });
    resetForm();
    renderTransactions();
    showToast("تمت استعادة البيانات التجريبية.", "info");
  });

  elements.list.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    if (button.dataset.action === "delete") deleteTransaction(button.dataset.id);
    if (button.dataset.action === "edit") startEditing(button.dataset.id);
  });
}

function initializeApp() {
  // Make the labels and amounts use Jordanian dinars, as required by the task.
  const amountLabel = document.querySelector('label[for="tx-amount"]');
  if (amountLabel) amountLabel.textContent = "المبلغ (د.أ)";
  elements.amount.placeholder = "0.00";
  elements.amount.setAttribute("aria-label", "المبلغ بالدينار الأردني");
  elements.balance.textContent = formatMoney(0);
  elements.income.textContent = formatMoney(0);
  elements.expense.textContent = formatMoney(0);

  transactions = loadTransactions();
  attachEvents();
  resetForm();
  renderTransactions();
}

document.addEventListener("DOMContentLoaded", initializeApp);
