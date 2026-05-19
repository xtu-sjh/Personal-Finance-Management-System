(function () {
  var currentUser = window.financeApp.requireCurrentUser();
  if (!currentUser) return;

  var showToast = window.financeApp.showToast || alert;
  var monthInput = document.getElementById('statisticsMonth');
  var trendMonthsSelect = document.getElementById('trendMonths');
  var alertEl = document.getElementById('statisticsAlert');
  var categoryDetails = document.getElementById('categoryDetails');
  var pieChart = null;
  var trendChart = null;
  var budgetData = []; // 缓存预算数据

  // 初始化
  document.getElementById('username').textContent = currentUser.username || '用户#' + currentUser.id;
  document.getElementById('logoutBtn').addEventListener('click', window.financeApp.logout);

  monthInput.value = window.financeApp.getCurrentMonth();
  monthInput.addEventListener('change', loadStatistics);
  trendMonthsSelect.addEventListener('change', loadStatistics);

  // 初始化 ECharts
  if (typeof echarts !== 'undefined') {
    pieChart = echarts.init(document.getElementById('statisticsPieChart'));
    trendChart = echarts.init(document.getElementById('trendChart'));
    window.addEventListener('resize', function() {
      pieChart && pieChart.resize();
      trendChart && trendChart.resize();
    });
  }

  loadStatistics();

  async function loadStatistics() {
    var month = monthInput.value || window.financeApp.getCurrentMonth();
    var months = Number(trendMonthsSelect.value || 6);

    try {
      var results = await Promise.allSettled([
        getSummary(month),
        getTrend(months),
        getBudgets(month)
      ]);

      var summary = results[0].status === 'fulfilled' ? results[0].value : null;
      var trend = results[1].status === 'fulfilled' ? results[1].value : { trend: [] };
      budgetData = results[2].status === 'fulfilled' ? (results[2].value || []) : [];

      renderSummary(summary);
      renderPieChart(summary ? (summary.categoryStats || []) : []);
      renderCategoryDetails(summary);
      renderTrendChart(trend.trend || []);

      var notices = [];
      if (results[0].status === 'rejected') {
        notices.push('月度汇总接口不可用，当前使用记录数据本地汇总。');
      }
      if (results[1].status === 'rejected') {
        notices.push('趋势接口不可用，当前使用记录数据本地聚合趋势。');
      }
      showAlert(notices.join(' '), notices.length ? 'warning' : '');
    } catch (e) {
      showAlert('加载统计数据失败: ' + (e.message || '未知错误'), 'error');
    }
  }

  async function getSummary(month) {
    try {
      var result = await api.get('/api/statistics/summary', {
        params: { userId: currentUser.id, month: month }
      });
      // 确保 incomeCategoryStats 字段存在（处理 SNAKE_CASE 命名策略）
      if (!result.incomeCategoryStats && !result.income_category_stats) {
        result.incomeCategoryStats = [];
      } else if (result.income_category_stats && !result.incomeCategoryStats) {
        result.incomeCategoryStats = result.income_category_stats;
      }
      if (!result.expenseCategoryStats && !result.expense_category_stats) {
        result.expenseCategoryStats = result.categoryStats || [];
      } else if (result.expense_category_stats && !result.expenseCategoryStats) {
        result.expenseCategoryStats = result.expense_category_stats;
      }
      return result;
    } catch (error) {
      var pageData = await api.get('/api/records', {
        params: { userId: currentUser.id, page: 1, size: 300, month: month }
      });
      return buildSummaryFromRecords(pageData.records || pageData || []);
    }
  }

  async function getTrend(months) {
    try {
      return await api.get('/api/statistics/trend', {
        params: { userId: currentUser.id, months: months }
      });
    } catch (error) {
      var pageData = await api.get('/api/records', {
        params: { userId: currentUser.id, page: 1, size: 500 }
      });
      return {
        trend: buildTrendFromRecords(pageData.records || pageData || [], months)
      };
    }
  }

  async function getBudgets(month) {
    try {
      return await api.get('/api/budget', {
        params: { userId: currentUser.id, month: month }
      });
    } catch (error) {
      return [];
    }
  }

  function buildSummaryFromRecords(records) {
    var expenseCategoryMap = {};
    var incomeCategoryMap = {};
    var income = 0;
    var expense = 0;

    records.forEach(function(record) {
      var amount = Number(record.amount || 0);
      if (record.type === 'income') {
        income += amount;
        var cat = record.category || '未分类';
        incomeCategoryMap[cat] = (incomeCategoryMap[cat] || 0) + amount;
      } else {
        expense += amount;
        var cat = record.category || '未分类';
        expenseCategoryMap[cat] = (expenseCategoryMap[cat] || 0) + amount;
      }
    });

    var expenseCategoryStats = Object.keys(expenseCategoryMap).map(function(name) {
      return { name: name, value: expenseCategoryMap[name], type: 'expense' };
    });
    var incomeCategoryStats = Object.keys(incomeCategoryMap).map(function(name) {
      return { name: name, value: incomeCategoryMap[name], type: 'income' };
    });

    return {
      income: income,
      expense: expense,
      balance: income - expense,
      categoryStats: expenseCategoryStats,
      incomeCategoryStats: incomeCategoryStats,
      expenseCategoryStats: expenseCategoryStats
    };
  }

  function buildTrendFromRecords(records, months) {
    var now = new Date();
    var monthKeys = [];
    for (var i = months - 1; i >= 0; i--) {
      var current = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthKeys.push(current.getFullYear() + '-' + String(current.getMonth() + 1).padStart(2, '0'));
    }

    var grouped = {};
    monthKeys.forEach(function(key) {
      grouped[key] = { month: key, income: 0, expense: 0 };
    });

    records.forEach(function(record) {
      var dateValue = record.recordDate || record.createTime;
      if (!dateValue) return;
      var monthKey = String(dateValue).slice(0, 7);
      if (!grouped[monthKey]) return;

      var amount = Number(record.amount || 0);
      if (record.type === 'income') {
        grouped[monthKey].income += amount;
      } else {
        grouped[monthKey].expense += amount;
      }
    });

    return monthKeys.map(function(key) { return grouped[key]; });
  }

  function renderSummary(summary) {
    var income = Number(summary ? summary.income : 0) || 0;
    var expense = Number(summary ? summary.expense : 0) || 0;
    var balance = Number(summary ? summary.balance : null) || (income - expense);

    document.getElementById('statisticsIncome').textContent = window.financeApp.formatCurrency(income);
    document.getElementById('statisticsExpense').textContent = window.financeApp.formatCurrency(expense);
    document.getElementById('statisticsBalance').textContent = window.financeApp.formatCurrency(balance);
  }

  function renderPieChart(categoryStats) {
    if (!pieChart) return;

    var data = normalizeCategoryStats(categoryStats);
    pieChart.setOption({
      tooltip: { trigger: 'item' },
      legend: {
        orient: 'vertical',
        right: '5%',
        top: 'center',
        itemGap: 12
      },
      series: [
        {
          type: 'pie',
          radius: ['36%', '68%'],
          center: ['45%', '50%'],
          label: {
            formatter: '{b}\n{d}%',
            fontSize: 12
          },
          data: data.length ? data : [{ name: '暂无支出数据', value: 1 }]
        }
      ]
    });
  }

  function getBudgetForCategory(category) {
    for (var i = 0; i < budgetData.length; i++) {
      if (budgetData[i].category === category) {
        return budgetData[i];
      }
    }
    return null;
  }

  function renderCategoryDetails(summary) {
    categoryDetails.innerHTML = '';

    if (!summary) {
      categoryDetails.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:20px;color:#888;">暂无数据</td></tr>';
      return;
    }

    var income = Number(summary.income || 0);
    var expense = Number(summary.expense || 0);

    // 获取分类数据，统一处理字段名（包括 SNAKE_CASE 命名策略）
    var expenseCategoryData = summary.expenseCategoryStats || summary.expense_category_stats || summary.categoryStats || [];
    var incomeCategoryData = summary.incomeCategoryStats || summary.income_category_stats || [];

    var expenseStats = expenseCategoryData.map(function(item) {
      return { name: item.name || item.category || '未分类', value: Number(item.value || item.amount || item.total || 0) };
    });
    var incomeStats = incomeCategoryData.map(function(item) {
      return { name: item.name || item.category || '未分类', value: Number(item.value || item.amount || item.total || 0) };
    });

    var html = '';

    // 显示支出分类
    if (expenseStats.length > 0) {
      html += '<tr><td colspan="4" style="background:var(--bg-secondary);font-weight:600;padding:10px 16px;">支出分类</td></tr>';
      expenseStats.forEach(function(item) {
        var percent = expense > 0 ? (item.value / expense * 100).toFixed(1) : 0;

        // 获取预算信息
        var budget = getBudgetForCategory(item.name);
        var budgetHtml = '';
        if (budget) {
          var budgetAmount = Number(budget.budgetAmount || budget.amount || 0);
          var spent = Number(budget.spent || 0);
          var progress = budgetAmount > 0 ? Math.min((spent / budgetAmount * 100), 100) : 0;
          var barClass = progress >= 100 ? 'danger' : progress >= 80 ? 'warning' : 'success';
          budgetHtml = '<div style="min-width:120px;">' +
            '<div style="font-size:12px;color:var(--text-secondary);margin-bottom:4px;">¥' + formatNumber(spent) + ' / ¥' + formatNumber(budgetAmount) + '</div>' +
            '<div style="background:var(--border);border-radius:4px;height:8px;width:100%;">' +
              '<div style="background:var(--' + barClass + ');height:100%;border-radius:4px;width:' + progress + '%;"></div>' +
            '</div>' +
          '</div>';
        } else {
          budgetHtml = '<span style="color:var(--text-tertiary);font-size:13px;">未设置预算</span>';
        }

        html += '<tr>' +
          '<td>' + window.financeApp.escapeHtml(item.name) + '</td>' +
          '<td class="value expense">-' + window.financeApp.formatCurrency(item.value) + '</td>' +
          '<td>' + percent + '%</td>' +
          '<td>' + budgetHtml + '</td>' +
        '</tr>';
      });
    }

    // 显示收入分类
    if (incomeStats.length > 0) {
      html += '<tr><td colspan="4" style="background:var(--bg-secondary);font-weight:600;padding:10px 16px;">收入分类</td></tr>';
      incomeStats.forEach(function(item) {
        var percent = income > 0 ? (item.value / income * 100).toFixed(1) : 0;

        html += '<tr>' +
          '<td>' + window.financeApp.escapeHtml(item.name) + '</td>' +
          '<td class="value income">+' + window.financeApp.formatCurrency(item.value) + '</td>' +
          '<td>' + percent + '%</td>' +
          '<td><span style="color:var(--text-tertiary);font-size:13px;">--</span></td>' +
        '</tr>';
      });
    }

    if (!expenseStats.length && !incomeStats.length) {
      html = '<tr><td colspan="4" style="text-align:center;padding:20px;color:#888;">暂无分类明细数据</td></tr>';
    }

    categoryDetails.innerHTML = html;
  }

  function renderTrendChart(trendData) {
    if (!trendChart) return;

    var normalized = Array.isArray(trendData) ? trendData : [];
    var labels = normalized.map(function(item) { return item.month || item.label || '--'; });
    var incomeSeries = normalized.map(function(item) { return Number(item.income || item.incomeAmount || 0); });
    var expenseSeries = normalized.map(function(item) { return Number(item.expense || item.expenseAmount || 0); });

    trendChart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['收入', '支出'] },
      grid: { left: 60, right: 24, top: 48, bottom: 36 },
      xAxis: {
        type: 'category',
        data: labels
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '收入',
          type: 'line',
          smooth: true,
          data: incomeSeries,
          itemStyle: { color: '#5A8A5E' },
          areaStyle: { color: 'rgba(90, 138, 94, 0.12)' }
        },
        {
          name: '支出',
          type: 'line',
          smooth: true,
          data: expenseSeries,
          itemStyle: { color: '#C4725A' },
          areaStyle: { color: 'rgba(196, 114, 90, 0.10)' }
        }
      ]
    });
  }

  function normalizeCategoryStats(categoryStats) {
    return Array.isArray(categoryStats)
      ? categoryStats.map(function(item) {
          return {
            name: item.name || item.category || '未分类',
            value: Number(item.value || item.amount || item.total || 0)
          };
        })
      : [];
  }

  function formatNumber(value) {
    return Number(value || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
})();
