(function () {
  var currentUser = window.financeApp.requireCurrentUser();
  if (!currentUser) return;

  var showToast = window.financeApp.showToast || alert;
  var currentPage = 1;
  var pageSize = 10;
  var totalRecords = 0;
  var allRecords = [];

  // 初始化
  document.getElementById('username').textContent = currentUser.username || '用户#' + currentUser.id;
  document.getElementById('logoutBtn').addEventListener('click', window.financeApp.logout);
  document.getElementById('addRecordBtn').addEventListener('click', openAddModal);
  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
  document.getElementById('resetFilterBtn').addEventListener('click', resetFilters);
  document.getElementById('recordForm').addEventListener('submit', saveRecord);

  // 筛选事件
  document.getElementById('filterDate').addEventListener('change', applyFilters);
  document.getElementById('filterCategory').addEventListener('change', applyFilters);
  document.getElementById('filterType').addEventListener('change', applyFilters);

  // 类型切换时更新分类选项
  document.getElementById('recordType').addEventListener('change', function() {
    loadCategoriesForSelect(this.value);
  });

  // 设置默认日期
  document.getElementById('recordDate').value = new Date().toISOString().slice(0, 10);

  // 加载分类和记录
  loadCategoriesForSelect('expense');
  loadFilterCategories();
  loadRecords();

  function openAddModal() {
    document.getElementById('modalTitle').textContent = '添加记录';
    document.getElementById('recordId').value = '';
    document.getElementById('recordForm').reset();
    document.getElementById('recordDate').value = new Date().toISOString().slice(0, 10);
    document.getElementById('recordType').value = 'expense';
    loadCategoriesForSelect('expense');
    document.getElementById('recordModal').style.display = 'flex';
  }

  function closeModal() {
    document.getElementById('recordModal').style.display = 'none';
  }

  // 点击弹窗外部关闭
  document.getElementById('recordModal').addEventListener('click', function(e) {
    if (e.target === this) {
      closeModal();
    }
  });

  async function loadCategoriesForSelect(type) {
    try {
      var result = await api.get('/api/categories', { params: { type: type } });
      var categories = result || [];
      var select = document.getElementById('recordCategory');
      select.innerHTML = '';
      categories.forEach(function(cat) {
        var option = document.createElement('option');
        option.value = cat.name;
        option.textContent = cat.name;
        select.appendChild(option);
      });
    } catch (e) {
      // 使用默认分类
      var defaultCategories = type === 'expense'
        ? ['餐饮', '购物', '交通', '住房', '娱乐', '医疗', '教育', '通讯', '其他支出']
        : ['工资', '奖金', '投资收益', '兼职收入', '其他收入'];
      var select = document.getElementById('recordCategory');
      select.innerHTML = '';
      defaultCategories.forEach(function(name) {
        var option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
      });
    }
  }

  async function loadFilterCategories() {
    try {
      var result = await api.get('/api/categories');
      var categories = result || [];
      var select = document.getElementById('filterCategory');
      select.innerHTML = '<option value="">全部</option>';
      categories.forEach(function(cat) {
        var option = document.createElement('option');
        option.value = cat.name;
        option.textContent = cat.name;
        select.appendChild(option);
      });
    } catch (e) {
      // 使用默认分类
      var defaultCategories = ['餐饮', '购物', '交通', '住房', '娱乐', '医疗', '教育', '通讯', '工资', '奖金', '投资收益'];
      var select = document.getElementById('filterCategory');
      select.innerHTML = '<option value="">全部</option>';
      defaultCategories.forEach(function(name) {
        var option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
      });
    }
  }

  async function loadRecords() {
    var tbody = document.getElementById('recordsList');
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;">加载中...</td></tr>';

    try {
      var params = {
        userId: currentUser.id,
        page: currentPage,
        size: pageSize
      };

      var filterDate = document.getElementById('filterDate').value;
      var filterCategory = document.getElementById('filterCategory').value;
      var filterType = document.getElementById('filterType').value;

      if (filterDate) {
        params.month = filterDate.substring(0, 7);
      }
      if (filterCategory) {
        params.category = filterCategory;
      }

      var result = await api.get('/api/records', { params: params });
      allRecords = result.records || result || [];
      totalRecords = result.total || allRecords.length;

      // 前端过滤类型
      if (filterType) {
        allRecords = allRecords.filter(function(r) { return r.type === filterType; });
      }

      renderRecords();
      renderPagination();
    } catch (e) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;color:#e74c3c;">加载失败: ' + (e.message || '未知错误') + '</td></tr>';
    }
  }

  function renderRecords() {
    var tbody = document.getElementById('recordsList');
    tbody.innerHTML = '';

    if (allRecords.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;">暂无记录</td></tr>';
      return;
    }

    allRecords.forEach(function(item) {
      var tr = document.createElement('tr');
      var typeText = item.type === 'expense' ? '支出' : '收入';
      var typeClass = item.type === 'expense' ? 'expense' : 'income';
      tr.innerHTML =
        '<td>' + escapeHtml(item.recordDate || '--') + '</td>' +
        '<td>' + escapeHtml(item.category || '--') + '</td>' +
        '<td class="value ' + typeClass + '">¥' + formatNumber(item.amount || 0) + '</td>' +
        '<td><span class="tag-' + typeClass + '">' + escapeHtml(typeText) + '</span></td>' +
        '<td>' + escapeHtml(item.remark || '--') + '</td>' +
        '<td>' +
          '<button class="btn btn-sm btn-outline edit-btn" data-id="' + item.id + '">编辑</button> ' +
          '<button class="btn btn-sm btn-danger delete-btn" data-id="' + item.id + '">删除</button>' +
        '</td>';
      tbody.appendChild(tr);
    });

    // 绑定编辑和删除事件
    tbody.querySelectorAll('.edit-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        openEditModal(this.getAttribute('data-id'));
      });
    });
    tbody.querySelectorAll('.delete-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        deleteRecord(this.getAttribute('data-id'));
      });
    });
  }

  function renderPagination() {
    var container = document.getElementById('pagination');
    var totalPages = Math.ceil(totalRecords / pageSize);

    if (totalPages <= 1) {
      container.innerHTML = '';
      return;
    }

    var html = '<div class="pagination-info">共 ' + totalRecords + ' 条，第 ' + currentPage + '/' + totalPages + ' 页</div>';
    html += '<div class="pagination-controls">';
    html += '<button class="pagination-btn" data-page="1" ' + (currentPage === 1 ? 'disabled' : '') + '>首页</button>';
    html += '<button class="pagination-btn" data-page="' + (currentPage - 1) + '" ' + (currentPage === 1 ? 'disabled' : '') + '>上一页</button>';

    var startPage = Math.max(1, currentPage - 2);
    var endPage = Math.min(totalPages, currentPage + 2);
    for (var i = startPage; i <= endPage; i++) {
      html += '<button class="pagination-btn ' + (i === currentPage ? 'active' : '') + '" data-page="' + i + '">' + i + '</button>';
    }

    html += '<button class="pagination-btn" data-page="' + (currentPage + 1) + '" ' + (currentPage === totalPages ? 'disabled' : '') + '>下一页</button>';
    html += '<button class="pagination-btn" data-page="' + totalPages + '" ' + (currentPage === totalPages ? 'disabled' : '') + '>末页</button>';
    html += '</div>';

    container.innerHTML = html;

    container.querySelectorAll('.pagination-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var page = parseInt(this.getAttribute('data-page'));
        if (page >= 1 && page <= totalPages) {
          currentPage = page;
          loadRecords();
        }
      });
    });
  }

  function openEditModal(id) {
    var record = allRecords.find(function(r) { return String(r.id) === String(id); });
    if (!record) return;

    document.getElementById('modalTitle').textContent = '编辑记录';
    document.getElementById('recordId').value = id;
    document.getElementById('recordDate').value = record.recordDate || '';
    document.getElementById('recordType').value = record.type || 'expense';
    document.getElementById('recordAmount').value = record.amount || '';
    document.getElementById('recordNote').value = record.remark || '';

    loadCategoriesForSelect(record.type || 'expense').then(function() {
      document.getElementById('recordCategory').value = record.category || '';
    });

    document.getElementById('recordModal').style.display = 'flex';
  }

  async function saveRecord(e) {
    e.preventDefault();

    var id = document.getElementById('recordId').value;
    var date = document.getElementById('recordDate').value;
    var type = document.getElementById('recordType').value;
    var category = document.getElementById('recordCategory').value;
    var amount = parseFloat(document.getElementById('recordAmount').value);
    var remark = document.getElementById('recordNote').value.trim();

    if (!date) {
      showToast('请选择日期', 'warning');
      return;
    }
    if (!category) {
      showToast('请选择分类', 'warning');
      return;
    }
    if (!amount || amount <= 0) {
      showToast('请输入有效金额', 'warning');
      return;
    }

    var btn = document.getElementById('saveRecordBtn');
    btn.disabled = true;
    btn.textContent = '保存中...';

    try {
      if (id) {
        // 编辑
        await api.put('/api/records/' + id, {
          type: type,
          category: category,
          amount: amount,
          recordDate: date,
          remark: remark
        });
        showToast('修改成功！', 'success');
      } else {
        // 添加
        await api.post('/api/records', {
          userId: currentUser.id,
          type: type,
          category: category,
          amount: amount,
          recordDate: date,
          remark: remark
        });
        showToast('添加成功！', 'success');
      }
      closeModal();
      loadRecords();
    } catch (e) {
      showToast('保存失败: ' + (e.message || '未知错误'), 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = '保存';
    }
  }

  async function deleteRecord(id) {
    if (!confirm('确定删除这条记录吗？')) return;

    try {
      await api.delete('/api/records/' + id);
      showToast('删除成功', 'success');
      loadRecords();
    } catch (e) {
      showToast('删除失败: ' + (e.message || '未知错误'), 'error');
    }
  }

  function applyFilters() {
    currentPage = 1;
    loadRecords();
  }

  function resetFilters() {
    document.getElementById('filterDate').value = '';
    document.getElementById('filterCategory').value = '';
    document.getElementById('filterType').value = '';
    currentPage = 1;
    loadRecords();
  }

  function escapeHtml(value) {
    return window.financeApp.escapeHtml(value);
  }

  function formatNumber(value) {
    return Number(value || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
})();
