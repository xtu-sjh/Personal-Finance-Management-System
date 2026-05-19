(function () {
  var currentUser = window.financeApp.requireCurrentUser();
  if (!currentUser) return;

  var showToast = window.financeApp.showToast || alert;
  var currentMonth = getCurrentMonth();

  // 初始化
  document.getElementById('username').textContent = currentUser.username || '用户#' + currentUser.id;
  document.getElementById('logoutBtn').addEventListener('click', window.financeApp.logout);
  document.getElementById('addBudgetBtn').addEventListener('click', openAddModal);
  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
  document.getElementById('budgetForm').addEventListener('submit', saveBudget);

  // 设置默认月份
  document.getElementById('budgetMonth').value = currentMonth;
  document.getElementById('budgetMonth').addEventListener('change', function() {
    currentMonth = this.value;
    loadBudgets();
  });

  // 加载预算信息
  loadBudgets();

  function getCurrentMonth() {
    return new Date().toISOString().slice(0, 7);
  }

  function openAddModal() {
    document.getElementById('modalTitle').textContent = '设置预算';
    document.getElementById('budgetId').value = '';
    document.getElementById('budgetForm').reset();
    loadCategoriesForSelect();
    document.getElementById('budgetModal').style.display = 'flex';
  }

  function closeModal() {
    document.getElementById('budgetModal').style.display = 'none';
  }

  // 点击弹窗外部关闭
  document.getElementById('budgetModal').addEventListener('click', function(e) {
    if (e.target === this) {
      closeModal();
    }
  });

  async function loadCategoriesForSelect() {
    try {
      var result = await api.get('/api/categories', { params: { type: 'expense' } });
      var categories = result || [];
      var select = document.getElementById('budgetCategory');
      select.innerHTML = '<option value="">请选择分类</option>';
      categories.forEach(function(cat) {
        var option = document.createElement('option');
        option.value = cat.name;
        option.textContent = cat.name;
        select.appendChild(option);
      });
    } catch (e) {
      // 使用默认支出分类
      var defaultCategories = ['餐饮', '购物', '交通', '住房', '娱乐', '医疗', '教育', '通讯', '其他支出'];
      var select = document.getElementById('budgetCategory');
      select.innerHTML = '<option value="">请选择分类</option>';
      defaultCategories.forEach(function(name) {
        var option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
      });
    }
  }

  async function loadBudgets() {
    var container = document.getElementById('budgetList');
    container.innerHTML = '<div style="text-align:center;padding:20px;">加载中...</div>';

    try {
      var result = await api.get('/api/budget', { params: { userId: currentUser.id, month: currentMonth } });
      var budgets = Array.isArray(result) ? result : [];

      renderSummary(budgets);
      renderBudgetList(budgets);
    } catch (e) {
      container.innerHTML = '<div style="text-align:center;padding:20px;color:#e74c3c;">加载失败: ' + (e.message || '未知错误') + '</div>';
    }
  }

  function renderSummary(budgets) {
    var totalBudget = 0;
    var totalUsed = 0;

    budgets.forEach(function(b) {
      totalBudget += Number(b.amount || b.budgetAmount || 0);
      totalUsed += Number(b.spent || 0);
    });

    var totalRemaining = totalBudget - totalUsed;

    document.getElementById('totalBudget').textContent = '¥' + formatNumber(totalBudget);
    document.getElementById('totalUsed').textContent = '¥' + formatNumber(totalUsed);
    document.getElementById('totalRemaining').textContent = '¥' + formatNumber(totalRemaining);

    // 设置颜色
    var remainingEl = document.getElementById('totalRemaining');
    remainingEl.className = 'value ' + (totalRemaining >= 0 ? 'balance' : 'expense');
  }

  function renderBudgetList(budgets) {
    var container = document.getElementById('budgetList');
    container.innerHTML = '';

    if (budgets.length === 0) {
      container.innerHTML = '<div style="text-align:center;padding:40px;color:#888;">暂无预算设置，点击"设置预算"按钮添加</div>';
      return;
    }

    budgets.forEach(function(budget) {
      var amount = Number(budget.amount || budget.budgetAmount || 0);
      var spent = Number(budget.spent || 0);
      var rate = amount > 0 ? (spent / amount * 100).toFixed(1) : 0;
      var remain = amount - spent;

      var item = document.createElement('div');
      item.className = 'budget-progress-item';
      item.innerHTML =
        '<div class="budget-progress-header">' +
          '<span class="budget-category">' + escapeHtml(budget.category) + '</span>' +
          '<span class="budget-amount">¥' + formatNumber(amount) + '</span>' +
        '</div>' +
        '<div class="progress-bar-container">' +
          '<div class="progress-bar ' + (rate >= 90 ? 'danger' : (rate >= 70 ? 'warning' : '')) + '" style="width: ' + Math.min(rate, 100) + '%"></div>' +
        '</div>' +
        '<div class="budget-progress-detail">' +
          '<span>已用: ¥' + formatNumber(spent) + '</span>' +
          '<span>剩余: ¥' + formatNumber(remain) + '</span>' +
          '<span>' + rate + '%</span>' +
        '</div>' +
        '<div class="budget-actions">' +
          '<button class="btn btn-sm btn-danger delete-btn" data-id="' + budget.id + '">删除</button>' +
        '</div>';
      container.appendChild(item);
    });

    // 绑定删除事件
    container.querySelectorAll('.delete-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        deleteBudget(this.getAttribute('data-id'));
      });
    });
  }

  async function saveBudget(e) {
    e.preventDefault();

    var category = document.getElementById('budgetCategory').value;
    var amount = parseFloat(document.getElementById('budgetAmount').value);

    if (!category) {
      showToast('请选择分类', 'warning');
      return;
    }
    if (!amount || amount <= 0) {
      showToast('请输入有效的预算金额', 'warning');
      return;
    }

    var btn = document.getElementById('saveBudgetBtn');
    btn.disabled = true;
    btn.textContent = '保存中...';

    try {
      await api.post('/api/budget', {
        userId: currentUser.id,
        category: category,
        amount: amount,
        month: currentMonth
      });
      showToast('预算设置成功！', 'success');
      closeModal();
      loadBudgets();
    } catch (e) {
      showToast('保存失败: ' + (e.message || '未知错误'), 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = '保存';
    }
  }

  async function deleteBudget(id) {
    if (!confirm('确定删除这个预算吗？')) return;

    try {
      await api.delete('/api/budget/' + id);
      showToast('删除成功', 'success');
      loadBudgets();
    } catch (e) {
      showToast('删除失败: ' + (e.message || '未知错误'), 'error');
    }
  }

  function escapeHtml(value) {
    return window.financeApp.escapeHtml(value);
  }

  function formatNumber(value) {
    return Number(value || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
})();
