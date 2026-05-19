(function () {
  var currentUser = window.financeApp.requireCurrentUser();
  if (!currentUser) return;

  var showToast = window.financeApp.showToast || alert;
  var allCategories = []; // 缓存所有分类用于重复检查

  // 初始化
  document.getElementById('username').textContent = currentUser.username || '用户#' + currentUser.id;
  document.getElementById('logoutBtn').addEventListener('click', window.financeApp.logout);
  document.getElementById('addCategoryBtn').addEventListener('click', openAddModal);
  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
  document.getElementById('categoryForm').addEventListener('submit', saveCategory);

  // 创建提示弹窗
  createDuplicateModal();

  // 加载分类
  loadCategories();

  function createDuplicateModal() {
    var modal = document.createElement('div');
    modal.id = 'duplicateModal';
    modal.style.cssText = 'display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:1001;align-items:center;justify-content:center;';
    modal.innerHTML =
      '<div style="background:white;border-radius:12px;padding:24px 32px;max-width:360px;width:90%;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,0.15);">' +
        '<div style="font-size:48px;margin-bottom:16px;">⚠️</div>' +
        '<h3 style="margin:0 0 12px;font-size:18px;color:#333;">提示</h3>' +
        '<p style="margin:0 0 24px;color:#666;font-size:15px;">你已有此分类</p>' +
        '<button id="closeDuplicateModal" style="background:#3D7A72;color:white;border:none;padding:10px 32px;border-radius:8px;font-size:14px;cursor:pointer;font-family:inherit;">确定</button>' +
      '</div>';
    document.body.appendChild(modal);

    document.getElementById('closeDuplicateModal').addEventListener('click', function() {
      modal.style.display = 'none';
    });
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  }

  function showDuplicateModal() {
    document.getElementById('duplicateModal').style.display = 'flex';
  }

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
      allCategories = result || [];

      var expenseCategories = allCategories.filter(function(c) { return c.type === 'expense'; });
      var incomeCategories = allCategories.filter(function(c) { return c.type === 'income'; });

      renderCategoryList('expenseCategories', expenseCategories, 'expense');
      renderCategoryList('incomeCategories', incomeCategories, 'income');

      document.getElementById('expenseCount').textContent = expenseCategories.length + ' 个';
      document.getElementById('incomeCount').textContent = incomeCategories.length + ' 个';
    } catch (e) {
      // 使用默认分类
      var defaultExpense = ['餐饮', '购物', '交通', '住房', '娱乐', '医疗', '教育', '通讯', '其他支出'];
      var defaultIncome = ['工资', '奖金', '投资收益', '兼职收入', '其他收入'];

      allCategories = [];
      defaultExpense.forEach(function(name) { allCategories.push({ name: name, type: 'expense' }); });
      defaultIncome.forEach(function(name) { allCategories.push({ name: name, type: 'income' }); });

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

  function checkDuplicate(name, type, excludeId) {
    return allCategories.some(function(cat) {
      if (excludeId && String(cat.id) === String(excludeId)) {
        return false; // 排除自身（编辑时）
      }
      return cat.name === name && cat.type === type;
    });
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

    // 检查重复分类
    if (checkDuplicate(name, type, id)) {
      showDuplicateModal();
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
      // 如果后端返回重复错误，显示自定义弹窗
      if (e.message && e.message.indexOf('已存在') !== -1) {
        showDuplicateModal();
      } else {
        showToast('保存失败: ' + (e.message || '未知错误'), 'error');
      }
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
