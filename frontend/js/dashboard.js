(function () {
  var currentUser = window.financeApp.requireCurrentUser();
  if (!currentUser) return;

  var showToast = window.financeApp.showToast || alert;
  var monthInput = document.getElementById('dashboardMonth');
  var alertEl = document.getElementById('dashboardAlert');
  var recentBills = document.getElementById('recentBills');
  var budgetSummary = document.getElementById('budgetSummary');
  var pieChart = null;

  // 初始化
  document.getElementById('username').textContent = currentUser.username || '用户#' + currentUser.id;
  monthInput.value = window.financeApp.getCurrentMonth();
  document.getElementById('logoutBtn').addEventListener('click', window.financeApp.logout);
  monthInput.addEventListener('change', loadDashboard);

  // 初始化 ECharts
  if (typeof echarts !== 'undefined') {
    pieChart = echarts.init(document.getElementById('expensePieChart'));
    window.addEventListener('resize', function() { pieChart && pieChart.resize(); });
  }

  loadDashboard();

  async function loadDashboard() {
    var month = monthInput.value || window.financeApp.getCurrentMonth();

    try {
      var results = await Promise.allSettled([
        getMonthlySummary(month),
        getRecentRecords(),
        getBudgetProgress(month)
      ]);

      var summary = results[0].status === 'fulfilled' ? results[0].value : null;
      var recentRecords = results[1].status === 'fulfilled' ? results[1].value : [];
      var budgets = results[2].status === 'fulfilled' ? results[2].value : [];

      renderSummary(summary);
      renderRecentRecords(recentRecords);
      renderBudgetProgress(budgets);
      renderExpenseChart(summary ? (summary.categoryStats || []) : []);

      var notices = [];
      if (results[0].status === 'rejected') {
        notices.push('统计接口不可用，当前已回退为基于记录的本地汇总。');
      }
      if (results[2].status === 'rejected') {
        notices.push('预算接口暂不可用，预算概览未展示真实后端数据。');
      }
      showAlert(notices.join(' '), notices.length ? 'warning' : '');
    } catch (e) {
      showAlert('加载仪表盘数据失败: ' + (e.message || '未知错误'), 'error');
    }
  }

  async function getMonthlySummary(month) {
    try {
      return await api.get('/api/statistics/summary', {
        params: { userId: currentUser.id, month: month }
      });
    } catch (error) {
      var recordsPage = await api.get('/api/records', {
        params: { userId: currentUser.id, page: 1, size: 200, month: month }
      });
      return buildSummaryFromRecords(recordsPage.records || recordsPage || []);
    }
  }

  async function getRecentRecords() {
    var pageData = await api.get('/api/records', {
      params: { userId: currentUser.id, page: 1, size: 5 }
    });
    return pageData.records || pageData || [];
  }

  async function getBudgetProgress(month) {
    return await api.get('/api/budget', {
      params: { userId: currentUser.id, month: month }
    });
  }

  function buildSummaryFromRecords(records) {
    var categoryMap = {};
    var income = 0;
    var expense = 0;

    records.forEach(function(record) {
      var amount = Number(record.amount || 0);
      if (record.type === 'income') {
        income += amount;
      } else {
        expense += amount;
        categoryMap[record.category] = (categoryMap[record.category] || 0) + amount;
      }
    });

    var categoryStats = Object.keys(categoryMap).map(function(name) {
      return { name: name, value: categoryMap[name] };
    });

    return {
      income: income,
      expense: expense,
      balance: income - expense,
      categoryStats: categoryStats
    };
  }

  function renderSummary(summary) {
    var income = Number(summary ? summary.income : 0) || 0;
    var expense = Number(summary ? summary.expense : 0) || 0;
    var balance = Number(summary ? summary.balance : null) || (income - expense);

    document.getElementById('incomeValue').textContent = window.financeApp.formatCurrency(income);
    document.getElementById('expenseValue').textContent = window.financeApp.formatCurrency(expense);
    document.getElementById('balanceValue').textContent = window.financeApp.formatCurrency(balance);
  }

  function renderExpenseChart(categoryStats) {
    if (!pieChart) return;

    var chartData = [];
    if (Array.isArray(categoryStats) && categoryStats.length > 0) {
      chartData = categoryStats.map(function(item) {
        return {
          name: item.name || item.category || '未分类',
          value: Number(item.value || item.amount || item.total || 0)
        };
      });
    }

    pieChart.setOption({
      tooltip: { trigger: 'item' },
      legend: { bottom: 0 },
      series: [
        {
          name: '支出分类',
          type: 'pie',
          radius: ['42%', '72%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            formatter: '{b}\n{d}%'
          },
          data: chartData.length ? chartData : [{ name: '暂无支出数据', value: 1 }]
        }
      ]
    });
  }

  function renderRecentRecords(records) {
    if (!records || records.length === 0) {
      recentBills.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:20px;color:#888;">暂无近期账单</td></tr>';
      return;
    }

    recentBills.innerHTML = records.map(function(record) {
      var typeClass = record.type === 'income' ? 'income' : 'expense';
      var typeText = record.type === 'income' ? '收入' : '支出';

      return '<tr>' +
        '<td>' + window.financeApp.escapeHtml(record.recordDate || '--') + '</td>' +
        '<td>' + window.financeApp.escapeHtml(record.category || '未分类') + '</td>' +
        '<td class="value ' + typeClass + '">¥' + formatNumber(record.amount || 0) + '</td>' +
        '<td><span class="tag-' + typeClass + '">' + typeText + '</span></td>' +
        '<td>' + window.financeApp.escapeHtml(record.remark || '--') + '</td>' +
      '</tr>';
    }).join('');
  }

  function renderBudgetProgress(budgets) {
    if (!Array.isArray(budgets) || budgets.length === 0) {
      budgetSummary.innerHTML = '<div style="text-align:center;padding:20px;color:#888;">当前月份暂无预算数据</div>';
      return;
    }

    budgetSummary.innerHTML = budgets.map(function(item) {
      var amount = Number(item.budgetAmount || item.amount || 0);
      var spent = Number(item.spent || 0);
      var progress = amount > 0 ? Math.min((spent / amount * 100), 100) : 0;
      var fillClass = progress >= 100 || item.overBudget ? 'danger' : progress >= 80 ? 'warning' : '';

      return '<div class="budget-item">' +
        '<div class="budget-label">' +
          '<span>' + window.financeApp.escapeHtml(item.category || '未分类') + '</span>' +
          '<span>¥' + formatNumber(spent) + ' / ¥' + formatNumber(amount) + '</span>' +
        '</div>' +
        '<div class="budget-bar">' +
          '<div class="budget-fill ' + fillClass + '" style="width:' + progress + '%"></div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function showAlert(message, type) {
    if (!message) {
      alertEl.className = 'alert';
      alertEl.textContent = '';
      return;
    }
    alertEl.textContent = message;
    alertEl.className = 'alert ' + (type || '') + ' show';
  }

  function formatNumber(value) {
    return Number(value || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
})();
