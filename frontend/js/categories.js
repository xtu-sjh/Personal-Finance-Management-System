(function () {
  var currentUser = window.financeApp.requireCurrentUser();
  if (!currentUser) return;

  var showToast = window.financeApp.showToast || alert;

  // 初始化
  document.getElementById('username').textContent = currentUser.username || '用户#' + currentUser.id;
  document.getElementById('logoutBtn').addEventListener('click', window.financeApp.logout);
  document.getElementById('addCategoryBtn').addEventListener('click', openAddModal);
  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
  document.getElementById('categoryForm').addEventListener('submit', saveCategory);

  // 加载分类
  loadCategories();

  function openAddModal() {
    document.getElementById('modalTitle').textContent = '添加分类';
    document.getElementById('categoryId').value = '';
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryType').value = 'expense';
    document.getElementById('categoryModal').style.display = 'flex';
  }

  function closeModal() {
    document.getElementById('categoryModal').style.display = 'none';
  }

  // 点击弹窗外部关闭
  document.getElementById('categoryModal').addEventListener('click', function(e) {
    if (e.target === this) {
      closeModal();
    }
  });

  async function loadCategories() {
    try {
      var result = await api.get('/api/categories');
      var categories = result || [];

      var expenseCategories = categories.filter(function(c) { return c.type === 'expense'; });
      var incomeCategories = categories.filter(function(c) { return c.type === 'income'; });

      renderCategoryList('expenseCategories', expenseCategories, 'expense');
      renderCategoryList('incomeCategories', incomeCategories, 'income');

      document.getElementById('expenseCount').textContent = expenseCategories.length + ' 个';
      document.getElementById('incomeCount').textContent = incomeCategories.length + ' 个';
    } catch (e) {
      // 使用默认分类
      var defaultExpense = ['餐饮', '购物', '交通', '住房', '娱乐', '医疗', '教育', '通讯', '其他支出'];
      var defaultIncome = ['工资', '奖金', '投资收益', '兼职收入', '其他收入'];

      renderDefaultCategories('expenseCategories', defaultExpense, 'expense');
      renderDefaultCategories('incomeCategories', defaultIncome, 'income');

      document.getElementById('expenseCount').textContent = defaultExpense.length + ' 个';
      document.getElementById('incomeCount').textContent = defaultIncome.length + ' 个';
    }
  }

  function renderDefaultCategories(containerId, names, type) {
    var container = document.getElementById(containerId);
    container.innerHTML = '';

    names.forEach(function(name) {
      var item = document.createElement('div');
      item.className = 'category-item';
      item.innerHTML =
        '<span class="category-name">' + escapeHtml(name) + '</span>' +
        '<div class="category-actions">' +
          '<span class="soft-tag">' + (type === 'expense' ? '支出' : '收入') + '</span>' +
        '</div>';
      container.appendChild(item);
    });
  }

  function renderCategoryList(containerId, categories, type) {
    var container = document.getElementById(containerId);
    container.innerHTML = '';

    if (categories.length === 0) {
      container.innerHTML = '<div style="text-align:center;padding:20px;color:#888;">暂无' + (type === 'expense' ? '支出' : '收入') + '分类</div>';
      return;
    }

    categories.forEach(function(category) {
      var item = document.createElement('div');
      item.className = 'category-item';
      item.innerHTML =
        '<span class="category-name">' + escapeHtml(category.name) + '</span>' +
        '<div class="category-actions">' +
          '<button class="btn btn-sm btn-outline edit-btn" data-id="' + category.id + '" data-name="' + escapeHtml(category.name) + '" data-type="' + type + '">编辑</button> ' +
          '<button class="btn btn-sm btn-danger delete-btn" data-id="' + category.id + '">删除</button>' +
        '</div>';
      container.appendChild(item);
    });

    // 绑定事件
    container.querySelectorAll('.edit-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        openEditModal(this.getAttribute('data-id'), this.getAttribute('data-name'), this.getAttribute('data-type'));
      });
    });
    container.querySelectorAll('.delete-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        deleteCategory(this.getAttribute('data-id'));
      });
    });
  }

  function openEditModal(id, name, type) {
    document.getElementById('modalTitle').textContent = '编辑分类';
    document.getElementById('categoryId').value = id;
    document.getElementById('categoryName').value = name;
    document.getElementById('categoryType').value = type;
    document.getElementById('categoryModal').style.display = 'flex';
  }

  async function saveCategory(e) {
    e.preventDefault();

    var id = document.getElementById('categoryId').value;
    var name = document.getElementById('categoryName').value.trim();
    var type = document.getElementById('categoryType').value;

    if (!name) {
      showToast('请输入分类名称', 'warning');
      return;
    }

    if (name.length > 20) {
      showToast('分类名称不能超过20个字符', 'warning');
      return;
    }

    var btn = document.getElementById('saveCategoryBtn');
    btn.disabled = true;
    btn.textContent = '保存中...';

    try {
      if (id) {
        // 编辑
        await api.put('/api/categories/' + id, { name: name });
        showToast('修改成功！', 'success');
      } else {
        // 添加
        await api.post('/api/categories', {
          name: name,
          type: type
        });
        showToast('添加成功！', 'success');
      }
      closeModal();
      loadCategories();
    } catch (e) {
      showToast('保存失败: ' + (e.message || '未知错误'), 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = '保存';
    }
  }

  async function deleteCategory(id) {
    if (!confirm('确定删除这个分类吗？')) return;

    try {
      await api.delete('/api/categories/' + id);
      showToast('删除成功', 'success');
      loadCategories();
    } catch (e) {
      showToast('删除失败: ' + (e.message || '未知错误'), 'error');
    }
  }

  function escapeHtml(value) {
    return window.financeApp.escapeHtml(value);
  }
})();
